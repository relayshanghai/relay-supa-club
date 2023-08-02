ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS sequences_all ON sequences;

CREATE POLICY sequences_all ON sequences FOR ALL
USING (
  is_activated_account()
);
