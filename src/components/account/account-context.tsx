/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@supabase/supabase-js';

import { createContext, FC, PropsWithChildren } from 'react';

import { useCompany } from 'src/hooks/use-company';

import { useUser } from 'src/hooks/use-user';
import { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import { ProfileDB } from 'src/utils/api/db/types';
import { StripePaymentMethods, StripePlanWithPrice } from 'types';

export interface AccountContextProps {
    userDataLoading: boolean;
    plans?: StripePlanWithPrice;
    paymentMethods?: StripePaymentMethods;
    profile: ProfileDB | null;
    user: User | null;
    company?: CompanyWithProfilesInvitesAndUsage;
    createInvite: (email: string) => void;
    refreshProfile: () => void;

    // TODO: make types for these
    upsertProfile: (data: any) => void;
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
    upsertProfile: () => {},
    refreshProfile: () => {}
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading: userDataLoading, upsertProfile, refreshProfile } = useUser();
    const { company, updateCompany, createInvite } = useCompany();

    return (
        <AccountContext.Provider
            value={{
                userDataLoading,
                profile,
                user,
                upsertProfile,
                company,
                updateCompany,
                createInvite,
                refreshProfile
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
