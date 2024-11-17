CREATE TABLE topup_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies (id),
    payment_transaction_id UUID NOT NULL REFERENCES payment_transactions (id),
    plan_id UUID NOT NULL REFERENCES plans (id),
    expired_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
