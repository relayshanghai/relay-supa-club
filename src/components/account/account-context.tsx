/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, FC, PropsWithChildren, useEffect, useState } from 'react';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';

export interface AccountContextProps {
    loading: boolean;
    firstName: string;
    lastName: string;
    email: string;
    setFieldValue: (field: string, value: string) => void;
    reset: Dispatch<any>;
    companyValues: any;
    setCompanyFieldValue: (field: string, value: string) => void;
    resetCompanyValues: Dispatch<any>;
    subscription: any;
    plans: any;
    paymentMethods: any;
    createSubscriptions: (planId: string) => void;
    confirmModal: any;
    setShowConfirmModal: (value: any) => void;
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
    setFieldValue: () => {},
    reset: () => {},
    companyValues: {},
    setCompanyFieldValue: () => {},
    resetCompanyValues: () => {},
    subscription: {},
    plans: {},
    paymentMethods: {},
    createSubscriptions: () => {},
    confirmModal: {},
    setShowConfirmModal: () => {},
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

    const [confirmModal, setShowConfirmModal] = useState<any>();
    const [inviteEmail, setInviteEmail] = useState<any>('');
    const [showAddMoreMembers, setShowAddMoreMembers] = useState<any>(false);

    const {
        values: { firstName, lastName, email },
        setFieldValue,
        reset
    } = useFields({
        firstName: '',
        lastName: '',
        email: ''
    });
    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValue,
        reset: resetCompanyValues
    } = useFields({
        name: '',
        website: ''
    });

    const subscription = subscriptionWrongType as any;

    useEffect(() => {
        if (!loading && profile) {
            reset({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email
            });
        }
    }, [loading, profile, user, reset]);

    useEffect(() => {
        if (company) {
            resetCompanyValues({ ...company });
        }
    }, [company, resetCompanyValues]);

    return (
        <AccountContext.Provider
            value={{
                loading,
                firstName,
                lastName,
                email,
                setFieldValue,
                reset,
                companyValues,
                setCompanyFieldValue,
                resetCompanyValues,
                subscription,
                plans,
                paymentMethods,
                createSubscriptions,
                confirmModal,
                setShowConfirmModal,
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
