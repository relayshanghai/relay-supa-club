ALTER TABLE public.campaign_notes DROP CONSTRAINT campaign_notes_campaign_creator_id_fkey;

ALTER TABLE public.campaign_notes
ADD CONSTRAINT campaign_notes_campaign_creator_id_fkey
FOREIGN KEY (campaign_creator_id)
REFERENCES public.campaign_creators (id)
ON DELETE CASCADE;
