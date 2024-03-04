CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL UNIQUE,
  "provider" VARCHAR(255) DEFAULT 'stripe' NOT NULL,
  provider_subscription_id VARCHAR(255) NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2),
  coupon VARCHAR(255),
  subscription_data JSON NOT NULL,
  active_at TIMESTAMP WITHOUT TIME ZONE,
  paused_at TIMESTAMP WITHOUT TIME ZONE,
  cancelled_at TIMESTAMP WITHOUT TIME ZONE,
  CONSTRAINT fk_company
  FOREIGN KEY (company_id)
  REFERENCES companies (id)
  ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX idx_provider_subscription_id ON subscriptions (provider_subscription_id);
CREATE INDEX idx_company_id ON subscriptions (company_id);
