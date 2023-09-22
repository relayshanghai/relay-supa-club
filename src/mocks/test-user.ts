import type { ProfileDB } from 'src/utils/api/db';

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
