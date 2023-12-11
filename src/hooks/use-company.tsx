import * as Sentry from '@sentry/browser';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';
import type { CompanyPutBody, CompanyPutResponse } from 'pages/api/company';

import { nextFetch } from 'src/utils/fetcher';
import { useUser } from './use-user';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import type { CompanyDB } from 'src/utils/api/db';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { clientLogger } from 'src/utils/logger-client';

export interface CompanyContext {
    company: CompanyDB | undefined;
    updateCompany: (input: Omit<CompanyPutBody, 'id'>) => Promise<CompanyPutResponse | null>;
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
    refreshCompany: () => null,
    companyExists: async () => null,
    isExpired: false,
});

export const CompanyProvider = ({ children }: PropsWithChildren) => {
    const { profile } = useUser();
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
