ALTER TABLE "public"."sequences" ADD COLUMN "deleted" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."sequence_emails"
DROP CONSTRAINT sequence_emails_sequence_influencer_id_fkey;

ALTER TABLE "public"."sequence_emails"
ADD CONSTRAINT sequence_emails_sequence_influencer_id_fkey
FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id)
ON DELETE CASCADE;
