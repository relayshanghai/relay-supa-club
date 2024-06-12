CREATE UNIQUE INDEX prices_price_id_key ON public.prices USING btree (price_id);

ALTER TABLE
"public"."prices"
ADD
CONSTRAINT "prices_price_id_key" UNIQUE USING INDEX "prices_price_id_key";
