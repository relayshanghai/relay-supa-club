ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS addresses_all ON addresses;

CREATE POLICY addresses_all ON addresses FOR ALL
USING (
  is_activated_account()
);
