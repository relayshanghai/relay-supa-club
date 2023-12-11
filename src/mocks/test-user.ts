import type { CompanyDB, ProfileDB } from 'src/utils/api/db';

export const testSequenceId = 'b7ddd2a8-e114-4423-8cc6-30513c885f07';

export const mockProfile: ProfileDB = {
    id: '6e6e65ca-dd79-4e62-90e4-9c5462991ae5',
    user_role: 'company_owner',
    company_id: '8e6e65ca-dd79-4e68-90e4-9c5462991ae4',
    avatar_url: null,
    email: 'mock@example.com',
    first_name: 'mock-first',
    last_name: 'mock-last',
    phone: null,
    updated_at: '2026-09-01T00:00:00.000Z',
    created_at: '2026-09-01T00:00:00.000Z',
    email_engine_account_id: 'nqnwq6g9ooqhfexa',
    sequence_send_email: 'test@boostbot.ai',
};

export const mockCompany: CompanyDB = {
    id: mockProfile.company_id || '',
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
    terms_accepted: true,
    subscription_plan: 'Discovery',
};
