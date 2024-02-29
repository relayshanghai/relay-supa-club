ALTER TABLE
"public"."sequences"
ADD
COLUMN "product_id" uuid NULL;

ALTER TABLE
"public"."sequences"
ADD
CONSTRAINT "sequence_product_fk" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE NOT VALID;
