CREATE TABLE prices (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "subscription_type" varchar(50) NOT NULL,
  "currency" varchar(3) NOT NULL,
  "billing_period" varchar(50) NOT NULL,
  "price" decimal(10, 2) NOT NULL,
  "profiles" int NOT NULL,
  "searches" int NOT NULL,
  "price_id" varchar(50) NOT NULL,
  "created_at" timestamp without time zone DEFAULT now(),
  "updated_at" timestamp without time zone DEFAULT now()
);
