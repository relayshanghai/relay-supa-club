/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@supabase/supabase-js';

import { createContext, FC, PropsWithChildren } from 'react';

import { useCompany } from 'src/hooks/use-company';

import { useUser } from 'src/hooks/use-user';
import {
    CompanyWithProfilesInvitesAndUsage,
    ProfileDB,
    StripePaymentMethods,
    StripePlansWithPrice
} from 'types';

export interface AccountContextProps {
    userDataLoading: boolean;
    plans?: StripePlansWithPrice;
    paymentMethods?: StripePaymentMethods;
    profile: ProfileDB | null;
    user: User | null;
    company?: CompanyWithProfilesInvitesAndUsage;
    createInvite: (email: string) => void;

    // TODO: make types for these
    updateProfile: (data: any) => void;
    updateCompany: (data: any) => void;
}

export const AccountContext = createContext<AccountContextProps>({
    userDataLoading: false,
    plans: undefined,
    paymentMethods: undefined,
    profile: null,
    user: null,
    company: undefined,
    createInvite: () => {},

    updateCompany: () => {},
    updateProfile: () => {}
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading: userDataLoading, updateProfile } = useUser();
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
                createInvite
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
