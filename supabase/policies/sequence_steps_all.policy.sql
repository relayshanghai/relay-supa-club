ALTER TABLE sequence_steps ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS sequence_steps_all ON sequence_steps;

CREATE POLICY sequence_steps_all ON sequence_steps FOR ALL
USING (
  is_activated_account()
);
