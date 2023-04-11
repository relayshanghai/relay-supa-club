CREATE UNIQUE INDEX influencer_categories_pkey ON public.influencer_categories USING btree (id);

CREATE UNIQUE INDEX influencer_posts_pkey ON public.influencer_posts USING btree (id);

CREATE UNIQUE INDEX influencer_profiles_pkey ON public.influencer_profiles USING btree (id);

CREATE UNIQUE INDEX influencers_pkey ON public.influencers USING btree (id);

alter table "public"."influencer_categories" add constraint "influencer_categories_pkey" PRIMARY KEY using index "influencer_categories_pkey";

alter table "public"."influencer_posts" add constraint "influencer_posts_pkey" PRIMARY KEY using index "influencer_posts_pkey";

alter table "public"."influencer_profiles" add constraint "influencer_profiles_pkey" PRIMARY KEY using index "influencer_profiles_pkey";

alter table "public"."influencers" add constraint "influencers_pkey" PRIMARY KEY using index "influencers_pkey";

alter table "public"."influencer_categories" add constraint "influencer_categories_influencer_fkey" FOREIGN KEY (influencer) REFERENCES influencers(id) not valid;

alter table "public"."influencer_categories" validate constraint "influencer_categories_influencer_fkey";

alter table "public"."influencer_posts" add constraint "influencer_posts_campaign_fkey" FOREIGN KEY (campaign) REFERENCES campaigns(id) not valid;

alter table "public"."influencer_posts" validate constraint "influencer_posts_campaign_fkey";

alter table "public"."influencer_posts" add constraint "influencer_posts_influencer_fkey" FOREIGN KEY (influencer) REFERENCES influencers(id) not valid;

alter table "public"."influencer_posts" validate constraint "influencer_posts_influencer_fkey";

alter table "public"."influencer_profiles" add constraint "influencer_profiles_influencer_fkey" FOREIGN KEY (influencer) REFERENCES influencers(id) not valid;

alter table "public"."influencer_profiles" validate constraint "influencer_profiles_influencer_fkey";
