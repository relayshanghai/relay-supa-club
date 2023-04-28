# Influencers

This table is the main table in the database and stores all the information related to an influencer across all their social media accounts. It typically includes the influencer's name, email address, phone number, and other personal information.

# Influencer Categories

This table is used to categorize influencers based on the type of content they post. For example, an influencer who focuses on beauty and makeup content may be categorized as a "Beauty Influencer." This table typically includes a list of categories, each with its own unique identifier, and a many-to-many relationship with the Influencers table.

# Influencer Profiles

This table stores information about an influencer's profile on each social media platform they use. It may include the influencer's username, profile picture, bio, follower count, following count, and other relevant details. This table typically has a one-to-many relationship with the Influencers table since each influencer may have multiple profiles on different platforms.

# Influencer Posts

This table stores information about the posts made by influencers on their social media accounts. It may include the date and time the post was made, the content of the post, the social media platform it was posted on, and any associated media (such as photos or videos). This table typically has a one-to-many relationship with the Influencers table since each influencer may have multiple posts.

# Posts Performance

This table stores information about the performance of each post made by influencers. It typically includes metrics such as the number of likes, comments, shares, and impressions the post received. This table can also include more advanced metrics such as engagement rates, reach, and conversion rates. This table typically has a one-to-one relationship with the Influencer_Posts table since each post has only one performance record.
