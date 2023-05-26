alter table "public"."posts_performance" drop constraint "posts_performance_influencer_id_fkey";

alter table "public"."posts_performance" drop column "influencer_id";

alter table "public"."posts_performance" add column "influencer_social_profile_id" uuid;

alter table "public"."posts_performance" add constraint "posts_performance_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."posts_performance" validate constraint "posts_performance_influencer_social_profile_id_fkey";


