CREATE UNIQUE INDEX influencer_categories_pkey ON public.influencer_categories USING btree (id);

CREATE UNIQUE INDEX influencer_posts_pkey ON public.influencer_posts USING btree (id);

CREATE UNIQUE INDEX influencer_social_profiles_pkey ON public.influencer_social_profiles USING btree (id);

CREATE UNIQUE INDEX influencers_pkey ON public.influencers USING btree (id);

ALTER TABLE "public"."influencer_categories" ADD CONSTRAINT "influencer_categories_pkey" PRIMARY KEY USING INDEX "influencer_categories_pkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_pkey" PRIMARY KEY USING INDEX "influencer_posts_pkey";

ALTER TABLE "public"."influencer_social_profiles" ADD CONSTRAINT "influencer_social_profiles_pkey" PRIMARY KEY USING INDEX "influencer_social_profiles_pkey";

ALTER TABLE "public"."influencers" ADD CONSTRAINT "influencers_pkey" PRIMARY KEY USING INDEX "influencers_pkey";

ALTER TABLE "public"."influencer_categories" ADD CONSTRAINT "influencer_categories_influencer_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_categories" VALIDATE CONSTRAINT "influencer_categories_influencer_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_campaign_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns (id) NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_campaign_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_influencer_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_influencer_fkey";

ALTER TABLE "public"."influencer_social_profiles" ADD CONSTRAINT "influencer_social_profiles_influencer_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_social_profiles" VALIDATE CONSTRAINT "influencer_social_profiles_influencer_fkey";
