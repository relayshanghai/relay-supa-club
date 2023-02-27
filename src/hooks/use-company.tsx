import type {
    CompanyGetQueries,
    CompanyGetResponse,
    CompanyPutBody,
    CompanyPutResponse,
} from 'pages/api/company';
import type { CompanyCreatePostBody, CompanyCreatePostResponse } from 'pages/api/company/create';

import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { createCompanyValidationErrors } from 'src/errors/company';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR, { KeyedMutator } from 'swr';
import { useUser } from './use-user';

export interface CompanyContext {
    company: CompanyGetResponse | undefined;
    updateCompany: (input: Omit<CompanyPutBody, 'id'>) => Promise<CompanyPutResponse | null>;
    createCompany: (input: {
        name: string;
        website?: string;
    }) => Promise<CompanyCreatePostResponse | null>;
    refreshCompany: KeyedMutator<CompanyGetResponse> | (() => void);
}

const ctx = createContext<CompanyContext>({
    company: undefined,
    updateCompany: async () => null,
    createCompany: async () => null,
    refreshCompany: () => null,
});

const useCompanyHook = () => {
    const { profile, user, refreshProfile } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR(
        profile?.company_id ? 'company' : null,
        (path) =>
            nextFetchWithQueries<CompanyGetQueries, CompanyGetResponse>(path, {
                id: profile?.company_id ?? '',
            }),
    );

    const updateCompany = useCallback(
        async (input: Omit<CompanyPutBody, 'id'>) => {
            if (!company?.id) throw new Error('No company found');
            const body: CompanyPutBody = {
                ...input,
                id: company.id,
            };
            return await nextFetch<CompanyPutResponse>(`company`, {
                method: 'PUT',
                body: JSON.stringify(body),
            });
        },
        [company?.id],
    );

    const createCompany = useCallback(
        async (input: { name: string; website?: string }) => {
            if (!user?.id) throw new Error(createCompanyValidationErrors.noLoggedInUserFound);
            if (!input.name) throw new Error(createCompanyValidationErrors.noCompanyNameFound);
            const body: CompanyCreatePostBody = {
                ...input,
                user_id: user?.id,
            };
            const res = await nextFetch<CompanyCreatePostResponse>(`company/create`, {
                method: 'post',
                body,
            });
            // create company adds company to user profile, so we need to refresh the profile
            refreshProfile();
            return res;
        },
        [refreshProfile, user],
    );

    return {
        company,
        updateCompany,
        createCompany,
        refreshCompany,
    };
};

export const CompanyProvider = ({ children }: PropsWithChildren) => {
    const { company, updateCompany, createCompany, refreshCompany } = useCompanyHook();

    return (
        <ctx.Provider
            value={{
                company,
                updateCompany,
                createCompany,
                refreshCompany,
            }}
        >
            {children}
        </ctx.Provider>
    );
};

export const useCompany = () => {
    const hooks = useContext(ctx);
    if (hooks === null) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return hooks;
};
