/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@supabase/supabase-js';
import { CompanyPutBody } from 'pages/api/company';
import { ProfilePutBody } from 'pages/api/profiles';

import { createContext, FC, PropsWithChildren } from 'react';

import { useCompany } from 'src/hooks/use-company';

import { useUser } from 'src/hooks/use-user';
import { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import { ProfileDB } from 'src/utils/api/db/types';
import Stripe from 'stripe';

export interface AccountContextProps {
    userDataLoading: boolean;
    paymentMethods?: Stripe.PaymentMethod[];
    profile: ProfileDB | null;
    user: User | null;
    company?: CompanyWithProfilesInvitesAndUsage;
    createInvite: (email: string) => void;
    refreshProfile: () => void;

    updateProfile: (data: Omit<ProfilePutBody, 'id'>) => void;
    updateCompany: (data: Omit<CompanyPutBody, 'id'>) => void;
}

export const AccountContext = createContext<AccountContextProps>({
    userDataLoading: false,

    paymentMethods: undefined,
    profile: null,
    user: null,
    company: undefined,
    createInvite: () => {},

    updateCompany: () => {},
    updateProfile: () => {},
    refreshProfile: () => {},
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading: userDataLoading, updateProfile, refreshProfile } = useUser();
    const { company, updateCompany, createInvite } = useCompany();

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
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
