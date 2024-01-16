alter table "public"."addresses" alter column "address_line_1" drop not null;

alter table "public"."addresses" alter column "city" drop not null;

alter table "public"."addresses" alter column "country" drop not null;

alter table "public"."addresses" alter column "name" drop not null;

alter table "public"."addresses" alter column "postal_code" drop not null;

alter table "public"."addresses" alter column "state" drop not null;


