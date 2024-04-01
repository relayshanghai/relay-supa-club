ALTER TABLE
public.billing_events
ADD
COLUMN created_at timestamp without time zone;

ALTER TABLE
public.billing_events
ADD
COLUMN updated_at timestamp without time zone;
