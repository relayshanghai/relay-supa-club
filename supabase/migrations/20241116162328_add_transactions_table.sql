CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies (id),
    provider_transaction_id VARCHAR(255) NOT NULL NOT NULL,
    paid_at timestamp with time zone NULL,
    cancelled_at timestamp with time zone NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
