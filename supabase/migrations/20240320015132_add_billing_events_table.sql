CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL UNIQUE,
  "provider" VARCHAR(255) DEFAULT 'stripe' NOT NULL,
  "data" jsonb NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  CONSTRAINT fk_company
  FOREIGN KEY (company_id)
  REFERENCES companies (id)
  ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX idx_company_id_billing_events ON billing_events (company_id);
