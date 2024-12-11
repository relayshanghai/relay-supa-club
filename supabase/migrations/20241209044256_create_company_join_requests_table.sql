CREATE TABLE company_join_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies (id),
    user_id UUID NOT NULL REFERENCES profiles (id),
    joined_at timestamp with time zone NULL DEFAULT NULL,
    ignored_at timestamp with time zone NULL DEFAULT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
