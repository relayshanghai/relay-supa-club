ALTER TABLE sequence_influencers ADD COLUMN schedule_status TEXT DEFAULT 'pending';
CREATE INDEX schedule_status_index ON sequence_influencers (schedule_status);
