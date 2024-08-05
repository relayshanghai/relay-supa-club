import React from 'react';
import { UserContext } from '../hooks/use-user';
import type { IUserContext } from '../hooks/use-user';
import { Provider as JotaiProvider } from 'jotai';
import type { WritableAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type { CompanyContext } from '../hooks/use-company';
import { companyContext } from '../hooks/use-company';
import { mockCompany, mockProfile } from '../mocks/test-user';

const mockUserContext: IUserContext = {
    user: null,
    profile: mockProfile,
    loading: false,
    login: async () => ({
        user: null,
        session: null,
    }),
    signup: async () => mockCompany,
    logout: () => null,
    updateProfile: () => null,
    paymentMethods: {},
    refreshCustomerInfo: () => null,
    refreshProfile: () => null,
    supabaseClient: null,
    getProfileController: { current: null },
};

export { mockCompany };
export interface TestMountOptions {
    /** The pathname that it will tell the router the app is currently visiting */
    pathname?: string;
    pushStub?: Cypress.Agent<any>;
    query?: Record<string, string>;
    useLocalStorageCache?: boolean;
    jotaiInitialValues?: InitialValues;
}

export type InitialValues = [WritableAtom<unknown, any[], any>, unknown][];

const mockCompanyContext: CompanyContext = {
    company: mockCompany,
    updateCompany: async () => null,
    companyExists: async () => null,
    refreshCompany: () => null,
    isExpired: false,
};

const HydrateAtoms = ({ initialValues, children }: { initialValues: InitialValues; children: React.ReactNode }) => {
    useHydrateAtoms(initialValues);
    return <>{children}</>;
};

export const JotaiTestProvider = ({
    initialValues,
    children,
}: {
    initialValues: InitialValues;
    children: React.ReactNode;
}) => (
    <JotaiProvider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </JotaiProvider>
);

export const UserAndCompanyTestWrapper = ({
    options,
    children,
}: {
    options?: TestMountOptions;
    children: React.ReactNode;
}) => (
    <UserContext.Provider value={mockUserContext}>
        <JotaiTestProvider initialValues={options?.jotaiInitialValues ?? []}>
            <companyContext.Provider value={mockCompanyContext}>{children}</companyContext.Provider>
        </JotaiTestProvider>
    </UserContext.Provider>
);
