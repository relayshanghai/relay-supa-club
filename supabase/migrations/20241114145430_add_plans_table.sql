CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    -- Name of the product or service
    price_type VARCHAR(255) NOT NULL,
    -- Type of price: subscription or top-up
    currency VARCHAR(10) NOT NULL,
    -- Currency code (e.g., USD, EUR)
    billing_period VARCHAR(10) NOT NULL,
    -- Billing period (e.g., one-time, monthly, yearly)
    price DECIMAL(12, 2) NOT NULL,
    -- Standard price
    original_price DECIMAL(12, 2) DEFAULT NULL,
    -- Original price before discounts
    existing_user_price DECIMAL(12, 2) DEFAULT NULL,
    -- Price for loyal users if applicable
    price_id varchar(50) DEFAULT NULL,
    original_price_id varchar(50) DEFAULT NULL,
    existing_user_price_id varchar(50) DEFAULT NULL,
    profiles INT NOT NULL,
    searches INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
