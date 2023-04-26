-- Only allow service key account to do any actions on the following tables

-- campaign_notes

ALTER TABLE campaign_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS campaign_notes_deny_all ON campaign_notes;

CREATE POLICY campaign_notes_deny_all ON campaign_notes FOR ALL
USING (
  false
);

-- invites

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS invites_deny_all ON invites;

CREATE POLICY invites_deny_all ON invites FOR ALL
USING (
  false
);

-- logs

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS logs_deny_all ON logs;

CREATE POLICY logs_deny_all ON logs FOR ALL
USING (
  false
);

-- logs

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS logs_deny_all ON logs;

CREATE POLICY logs_deny_all ON logs FOR ALL
USING (
  false
);

-- usages

ALTER TABLE usages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS usages_deny_all ON usages;

CREATE POLICY usages_deny_all ON usages FOR ALL
USING (
  false
);
