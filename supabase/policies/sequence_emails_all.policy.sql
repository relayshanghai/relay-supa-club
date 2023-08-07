ALTER TABLE sequence_emails ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS sequence_emails_all ON sequence_emails;

CREATE POLICY sequence_emails_all ON sequence_emails FOR ALL
USING (
  is_activated_account()
);
