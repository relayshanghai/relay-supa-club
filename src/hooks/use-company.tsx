import * as Sentry from '@sentry/browser';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';
import type { CompanyPutBody, CompanyPutResponse } from 'pages/api/company';
import type { CompanyCreatePostBody, CompanyCreatePostResponse } from 'pages/api/company/create';
import { createCompanyValidationErrors } from 'src/errors/company';
import { nextFetch } from 'src/utils/fetcher';
import { useUser } from './use-user';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import type { CompanyDB } from 'src/utils/api/db';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { clientLogger } from 'src/utils/logger-client';
import type { CompanySize } from 'types';

export interface CompanyContext {
    company: CompanyDB | undefined;
    updateCompany: (input: Omit<CompanyPutBody, 'id'>) => Promise<CompanyPutResponse | null>;
    createCompanyLegacy: (input: {
        name: string;
        website?: string;
        size?: CompanySize;
        category?: string;
    }) => Promise<CompanyCreatePostResponse | null>;
    createCompany: (input: {
        name: string;
        website?: string;
        size?: CompanySize;
        category?: string;
        profileId: string;
    }) => Promise<CompanyCreatePostResponse | null>;
    refreshCompany: KeyedMutator<CompanyDB> | (() => void);
    companyExists: (name: string) => Promise<{
        exists: boolean;
        error?: string;
        mail?: string;
    } | null>;
    isExpired: boolean;
}

export const companyContext = createContext<CompanyContext>({
    company: undefined,
    updateCompany: async () => null,
    createCompanyLegacy: async () => null,
    createCompany: async () => null,
    refreshCompany: () => null,
    companyExists: async () => null,
    isExpired: false,
});

export const CompanyProvider = ({ children }: PropsWithChildren) => {
    const { profile, refreshProfile } = useUser();
    const { getCompanyById } = useClientDb();
    const clientRoleData = useAtomValue(clientRoleAtom);
    const companyId = clientRoleData.companyId || profile?.company_id;

    // @note why not fetch it along the profile in useUser?
    const { data: company, mutate: refreshCompany } = useSWR(
        profile && companyId ? [companyId, 'company'] : null,
        async ([id]) => {
            const fetchedCompany = await getCompanyById(id);
            if (profile && fetchedCompany?.name && !company?.name) {
                Sentry.setUser({
                    id: profile.id,
                    email: profile.email ?? '',
                    name: `${profile.first_name} ${profile.last_name}`,
                    company_name: clientRoleData.companyName || fetchedCompany.name,
                    company_id: id,
                });
            }
            return fetchedCompany;
        },
    );

    // @note this will wait for profile to load and rerender for refreshCompany
    useEffect(() => {
        refreshCompany();
    }, [clientRoleData.companyId, refreshCompany]);

    const updateCompany = useCallback(
        async (input: Omit<CompanyPutBody, 'id'>) => {
            if (!companyId) throw new Error('No company found');
            const body: CompanyPutBody = {
                ...input,
                id: companyId,
            };
            return await nextFetch<CompanyPutResponse>(`company`, {
                method: 'PUT',
                body: JSON.stringify(body),
            });
        },
        [companyId],
    );

    const createCompanyLegacy = useCallback(
        async (input: { name: string; website?: string; size?: CompanySize; category?: string }) => {
            if (!profile?.id) throw new Error(createCompanyValidationErrors.noLoggedInUserFound);
            if (!input.name) throw new Error(createCompanyValidationErrors.noCompanyNameFound);

            const body: CompanyCreatePostBody = {
                ...input,
                user_id: profile?.id,
            };
            const res = await nextFetch<CompanyCreatePostResponse>(`company/create`, {
                method: 'post',
                body,
            });
            // create company adds company to user profile, so we need to refresh the profile
            refreshProfile();
            return res;
        },
        [refreshProfile, profile],
    );

    const companyExists = async (name: string) => {
        try {
            const res = await nextFetch<{ message: string } | { error: string }>(`company/exists?name=${name}`, {
                method: 'get',
            });
            if (res) {
                return {
                    exists: false,
                };
            }
        } catch (e) {
            if (e instanceof Error) {
                return {
                    exists: true,
                    mail: e.message,
                };
            }
        }
        return {
            exists: false,
            error: 'unknown error',
        };
    };

    const createCompany = useCallback(
        async (input: { name: string; website?: string; size?: CompanySize; category?: string; profileId: string }) => {
            if (!input.profileId) throw new Error(createCompanyValidationErrors.noLoggedInUserFound);
            if (!input.name) throw new Error(createCompanyValidationErrors.noCompanyNameFound);

            const body: CompanyCreatePostBody = {
                ...input,
                user_id: input.profileId,
            };
            const res = await nextFetch<CompanyCreatePostResponse>(`company/create`, {
                method: 'post',
                body,
            });
            // create company adds company to user profile, so we need to refresh the profile
            refreshProfile();
            return res;
        },
        [refreshProfile],
    );

    const isExpired = useMemo(
        () =>
            company?.subscription_status === 'paused' ||
            (company?.subscription_status === 'canceled' &&
                company?.subscription_end_date &&
                new Date().toISOString() >= company?.subscription_end_date)
                ? true
                : false,
        [company],
    );

    return (
        <companyContext.Provider
            value={{
                company,
                updateCompany,
                createCompany,
                createCompanyLegacy,
                refreshCompany,
                companyExists,
                isExpired,
            }}
        >
            {children}
        </companyContext.Provider>
    );
};

export const useCompany = () => {
    const context = useContext(companyContext);
    if (!context) {
        clientLogger('useCompany must be used within a CompanyProvider');
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
