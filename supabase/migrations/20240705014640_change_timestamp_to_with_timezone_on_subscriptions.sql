-- altering table subscription change active_at, paused_at, canceled_at to timestamp with time zone
ALTER TABLE subscriptions
  ALTER COLUMN active_at SET DATA TYPE timestamp with time zone,
  ALTER COLUMN paused_at SET DATA TYPE timestamp with time zone,
  ALTER COLUMN cancelled_at SET DATA TYPE timestamp with time zone;
