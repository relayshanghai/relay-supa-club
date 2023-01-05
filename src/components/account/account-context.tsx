/* eslint-disable @typescript-eslint/no-empty-function */
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
import { CompanyWithProfilesInvitesAndUsage } from 'types';

interface ConfirmModalData {
    name?: string;
    show?: boolean;
    usage_limit?: number;
    prices?: any[];
}
export interface AccountContextProps {
    loading: boolean;
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
    subscription: any;
    plans: any;
    paymentMethods: any;
    createSubscriptions: (planId: string) => void;
    confirmModalData: ConfirmModalData;
    setConfirmModalData: (value: ConfirmModalData) => void;
    inviteEmail: string;
    setInviteEmail: (value: string) => void;
    showAddMoreMembers: boolean;
    setShowAddMoreMembers: (value: boolean) => void;
    profile: any;
    user: any;
    updateProfile: (data: any) => void;
    company: any;
    updateCompany: (data: any) => void;
    createInvite: (data: any) => void;
}

export const AccountContext = createContext<AccountContextProps>({
    loading: false,
    firstName: '',
    lastName: '',
    email: '',
    setUserFieldValues: () => {},
    resetUserValues: () => {},
    companyValues: {},
    setCompanyFieldValues: () => {},
    resetCompanyValues: () => {},
    subscription: {},
    plans: {},
    paymentMethods: {},
    createSubscriptions: () => {},
    confirmModalData: {},
    setConfirmModalData: () => {},
    inviteEmail: '',
    setInviteEmail: () => {},
    showAddMoreMembers: false,
    setShowAddMoreMembers: () => {},
    profile: {},
    user: {},
    updateProfile: () => {},
    company: {},
    updateCompany: () => {},
    createInvite: () => {}
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { profile, user, loading, updateProfile } = useUser();
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
        if (!loading && profile) {
            resetUserValues({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email || ''
            });
        }
    }, [loading, profile, user, resetUserValues]);

    useEffect(() => {
        if (company) {
            resetCompanyValues(company);
        }
    }, [company, resetCompanyValues]);

    return (
        <AccountContext.Provider
            value={{
                loading,
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
