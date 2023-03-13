import type { CompanyDB, ProfileDB } from 'src/utils/api/db';

//Reference: https://supabase.com/docs/guides/database/webhooks#payload
export type InsertProfilePayload = {
    type: 'INSERT';
    table: string;
    schema: string;
    record: ProfileDB;
    old_record: null;
};

export type InsertCompanyPayload = {
    type: 'INSERT';
    table: string;
    schema: string;
    record: CompanyDB;
    old_record: null;
};

export type UpdateCompanyPayload = {
    type: 'UPDATE';
    table: string;
    schema: string;
    record: CompanyDB;
    old_record: CompanyDB;
};
