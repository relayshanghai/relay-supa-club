ALTER TABLE
    subscriptions
ADD
    COLUMN interval VARCHAR(50) NOT NULL DEFAULT 'monthly';
