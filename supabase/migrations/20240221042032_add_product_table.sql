alter table "public"."products" 
ADD column "name" varchar not null default '',
ADD column "company_id" uuid null;

alter table "public"."products" add constraint "product_company_fk" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;
