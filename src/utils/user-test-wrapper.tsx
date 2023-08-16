import React from 'react';
import { UserContext } from 'src/hooks/use-user';
import type { IUserContext } from 'src/hooks/use-user';
import { Provider as JotaiProvider } from 'jotai';
import type { WritableAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type { CompanyContext } from 'src/hooks/use-company';
import { companyContext } from 'src/hooks/use-company';
import type { CompanyDB } from './api/db';

const mockProfile: IUserContext['profile'] = {
    id: '1',
    user_role: 'company_owner',
    company_id: '8e6e65ca-dd79-4e68-90e4-9c5462991ae4',
    avatar_url: null,
    email: 'mock@example.com',
    first_name: 'mock-first',
    last_name: 'mock-last',
    phone: null,
    updated_at: '2021-09-01T00:00:00.000Z',
    created_at: '2021-09-01T00:00:00.000Z',
    email_engine_account_id: 'e7ustgsqqvy9al6f',
    sequence_send_email: 'relayemailertest@gmail.com',
};

const mockUserContext: IUserContext = {
    user: null,
    profile: mockProfile,
    loading: false,
    login: async () => ({
        user: null,
        session: null,
    }),
    createEmployee: async () => null,
    logout: () => null,
    signup: async () => ({
        user: null,
        session: null,
    }),
    updateProfile: () => null,
    refreshProfile: () => null,
    supabaseClient: null,
    getProfileController: { current: null },
};

const mockCompany: CompanyDB = {
    id: '615478e4-72bf-4162-9736-0d2f89b2191e',
    created_at: '2023-06-08T09:18:58.294957+00:00',
    name: 'Blue Moonlight Stream Enterprises',
    website: 'https://blue-moonlight-stream.com',
    avatar_url: null,
    updated_at: null,
    cus_id: 'cus_NKXV4aQYAU7GXG',
    searches_limit: '100000000',
    profiles_limit: '100000000',
    subscription_status: 'active',
    trial_searches_limit: '',
    trial_profiles_limit: '',
    subscription_start_date: '2023-06-08T09:18:58.294957+00:00',
    subscription_end_date: '2025-01-01 00:00:00.000000+00',
    subscription_current_period_end: '2025-01-01T00:00:00+00:00',
    subscription_current_period_start: '2023-06-08T09:18:58.294957+00:00',
    ai_email_generator_limit: '100000000',
    trial_ai_email_generator_limit: '10',
    size: 'small',
};
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
    createCompanyLegacy: async () => null,
    createCompany: async () => null,
    refreshCompany: () => null,
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
