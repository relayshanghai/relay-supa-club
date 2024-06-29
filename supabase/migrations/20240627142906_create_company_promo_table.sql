CREATE TABLE company_promos (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL UNIQUE,
    "promo" varchar(50) NOT NULL,
    "created_at" timestamp without time zone DEFAULT now(),
    "updated_at" timestamp without time zone DEFAULT now()
);
