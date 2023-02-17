/* eslint-disable @typescript-eslint/no-empty-function */
import { SupabaseClient, User } from '@supabase/supabase-js';
import type { CompanyPutBody } from 'pages/api/company';
import type { ProfilePutBody } from 'pages/api/profiles';

import { createContext, FC, PropsWithChildren } from 'react';

import { useCompany } from 'src/hooks/use-company';

import { useUser } from 'src/hooks/use-user';
import type { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import type { ProfileDB } from 'src/utils/api/db/types';
import type Stripe from 'stripe';
import { DatabaseWithCustomTypes } from 'types';

export interface AccountContextProps {
    userDataLoading: boolean;
    paymentMethods?: Stripe.PaymentMethod[];
    profile: ProfileDB | undefined;
    user: User | null;
    company?: CompanyWithProfilesInvitesAndUsage;
    createInvite: (email: string, companyOwner: boolean) => void;
    refreshProfile: () => void;
    refreshCompany: () => void;
    updateProfile: (data: Omit<ProfilePutBody, 'id'>) => void;
    updateCompany: (data: Omit<CompanyPutBody, 'id'>) => void;
    supabaseClient: SupabaseClient<DatabaseWithCustomTypes> | null;
}

export const AccountContext = createContext<AccountContextProps>({
    userDataLoading: false,

    paymentMethods: undefined,
    profile: undefined,
    user: null,
    company: undefined,
    createInvite: () => {},

    updateCompany: () => {},
    updateProfile: () => {},
    refreshProfile: () => {},
    refreshCompany: () => {},
    supabaseClient: null,
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const {
        profile,
        user,
        loading: userDataLoading,
        updateProfile,
        refreshProfile,
        supabaseClient,
    } = useUser();
    const { company, updateCompany, createInvite, refreshCompany } = useCompany();
    // TODO: make useCompany a context provider and use it in components that need it. get rid of this Context.
    // https://github.com/relayshanghai/relay-supa-club/pull/98#discussion_r1108165502
    // https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/148

    return (
        <AccountContext.Provider
            value={{
                userDataLoading,
                profile,
                user,
                updateProfile,
                company,
                updateCompany,
                createInvite,
                refreshProfile,
                refreshCompany,
                supabaseClient,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
