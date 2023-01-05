/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@supabase/supabase-js';

import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState
} from 'react';

import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';
import {
    CompanyWithProfilesInvitesAndUsage,
    ProfileDB,
    StripePaymentMethods,
    StripePlansWithPrice
} from 'types';

interface ConfirmModalData {
    name?: string;
    show?: boolean;
    usage_limit?: number;
    prices?: any[];
}
export interface AccountContextProps {
    userDataLoading: boolean;
    firstName: string;
    lastName: string;
    email: string;
    setUserFieldValues: (name: 'firstName' | 'lastName' | 'email', value: string) => void;
    resetUserValues: Dispatch<
        SetStateAction<{
            firstName: string;
            lastName: string;
            email: string;
        }>
    >;
    companyValues: Partial<CompanyWithProfilesInvitesAndUsage>;
    setCompanyFieldValues: (
        field: keyof CompanyWithProfilesInvitesAndUsage,
        value: CompanyWithProfilesInvitesAndUsage[keyof CompanyWithProfilesInvitesAndUsage]
    ) => void;
    resetCompanyValues: Dispatch<SetStateAction<Partial<CompanyWithProfilesInvitesAndUsage>>>;
    createSubscriptions: (planId: string) => void;
    confirmModalData: ConfirmModalData;
    setConfirmModalData: (value: ConfirmModalData) => void;
    inviteEmail: string;
    setInviteEmail: (value: string) => void;
    showAddMoreMembers: boolean;
    setShowAddMoreMembers: (value: boolean) => void;
    profile: ProfileDB | null;
    user: User | null;
    company?: CompanyWithProfilesInvitesAndUsage;
    plans?: StripePlansWithPrice;
    createInvite: (email: string) => void;
    paymentMethods?: StripePaymentMethods;

    // TODO: get types for these
    updateProfile: (data: any) => void;
    updateCompany: (data: any) => void;
    subscription: any;
}

export const AccountContext = createContext<AccountContextProps>({
    userDataLoading: false,
    firstName: '',
    lastName: '',
    email: '',
    setUserFieldValues: () => {},
    resetUserValues: () => {},
    companyValues: {},
    setCompanyFieldValues: () => {},
    resetCompanyValues: () => {},
    subscription: {},
    plans: undefined,
    paymentMethods: undefined,
    createSubscriptions: () => {},
    confirmModalData: {},
    setConfirmModalData: () => {},
    inviteEmail: '',
    setInviteEmail: () => {},
    showAddMoreMembers: false,
    setShowAddMoreMembers: () => {},
    profile: null,
    user: null,
    updateProfile: () => {},
    company: undefined,
    updateCompany: () => {},
    createInvite: () => {}
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading: userDataLoading, updateProfile } = useUser();
    const { company, updateCompany, createInvite } = useCompany();
    const {
        subscription: subscriptionWrongType,
        plans,
        paymentMethods,
        createSubscriptions
    } = useSubscription();

    const [confirmModalData, setConfirmModalData] = useState<
        AccountContextProps['confirmModalData']
    >({});
    const [inviteEmail, setInviteEmail] = useState('');
    const [showAddMoreMembers, setShowAddMoreMembers] = useState(false);

    const {
        values: { firstName, lastName, email },
        setFieldValue: setUserFieldValues,
        reset: resetUserValues
    } = useFields({
        firstName: '',
        lastName: '',
        email: ''
    });
    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValues,
        reset: resetCompanyValues
    } = useFields<Partial<CompanyWithProfilesInvitesAndUsage>>({
        name: '',
        website: ''
    });

    const subscription = subscriptionWrongType as any;

    useEffect(() => {
        if (!userDataLoading && profile) {
            resetUserValues({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email || ''
            });
        }
    }, [userDataLoading, profile, user, resetUserValues]);

    useEffect(() => {
        if (company) {
            resetCompanyValues(company);
        }
    }, [company, resetCompanyValues]);

    return (
        <AccountContext.Provider
            value={{
                userDataLoading,
                firstName,
                lastName,
                email,
                setUserFieldValues,
                resetUserValues,
                companyValues,
                setCompanyFieldValues,
                resetCompanyValues,
                subscription,
                plans,
                paymentMethods,
                createSubscriptions,
                confirmModalData,
                setConfirmModalData,
                inviteEmail,
                setInviteEmail,
                showAddMoreMembers,
                setShowAddMoreMembers,
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
