/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@supabase/supabase-js';
import type { CompanyPutBody } from 'pages/api/company';
import type { ProfilePutBody } from 'pages/api/profiles';

import { createContext, FC, PropsWithChildren } from 'react';

import { useCompany } from 'src/hooks/use-company';

import { useUser } from 'src/hooks/use-user';
import type { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import type { ProfileDB } from 'src/utils/api/db/types';
import type Stripe from 'stripe';

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
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading: userDataLoading, updateProfile, refreshProfile } = useUser();
    const { company, updateCompany, createInvite, refreshCompany } = useCompany();

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
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
