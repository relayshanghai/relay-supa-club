import { CompanyGetQueries, CompanyPutBody, CompanyPutResponse } from 'pages/api/company';
import { CompanyCreatePostBody, CompanyCreatePostResponse } from 'pages/api/company/create';
import {
    CompanyCreateInvitePostBody,
    CompanyCreateInvitePostResponse,
} from 'pages/api/company/create-invite';
import { useCallback } from 'react';
import { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const createCompanyValidationErrors = {
    noLoggedInUserFound: 'noLoggedInUserFound',
    noCompanyNameFound: 'noCompanyNameFound',
};

export const useCompany = () => {
    const { profile, user, refreshProfile } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR(
        profile?.company_id ? 'company' : null,
        (path) =>
            nextFetchWithQueries<CompanyGetQueries, CompanyWithProfilesInvitesAndUsage>(path, {
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

    const createInvite = useCallback(
        async (email: string) => {
            if (!profile?.company_id) throw new Error('No profile found');
            const body: CompanyCreateInvitePostBody = {
                email: email,
                company_id: profile.company_id,
                name: `${profile.first_name} ${profile.last_name}`,
            };
            return await nextFetch<CompanyCreateInvitePostResponse>(`company/create-invite`, {
                method: 'post',
                body,
            });
        },
        [profile],
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
        createInvite,
        createCompany,
        refreshCompany,
    };
};
