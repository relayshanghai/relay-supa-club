const guidePage = {
    welcome: 'Welcome to',
    welcomeDescription: 'Need help? Check out the topics below for more information about our platform!',
    goBack: 'Back to Guide',
    goto: 'Go to',
    learnMore: 'Learn More',
    cards: {
        discover: {
            title: 'Discover KOL',
            description:
                'With a database of over 275 million accounts across 3 platforms, we give you the data driven tools you need to find the perfect influencers.',
        },
        campaigns: {
            title: 'Manage Campaigns',
            description:
                'Influencer marketing is time consuming enough as it is, that’s why we provide you our Campaign CRM system to keep yourself organized.',
        },
        performance: {
            title: 'Track Performance',
            description:
                'No more spreadsheets - just input the content link and we’ll track views, likes, comments, and sales for you!',
        },
        account: {
            title: 'Monitor Your Usage',
            description:
                'Check to see who has access to your campaigns and how many influencer profiles you have opened.',
        },
        aiEmailGenerator: {
            title: 'Tailor Your Outreach',
            description: 'Increase your conversion rates with customized emails to send to potential influencers.',
        },
    },
    modalInfo: {
        discover: {
            title: 'Discover KOL',
            url: '/dashboard',
            sections: [
                {
                    title: 'Topic-based Search',
                    description:
                        'By analyzing profile and content information for all influencer accounts, we use topics as a way of labeling the influencers according to their actual content and channel focus. Topics are a great way to find the most relevant influencers in a specific niche. Try keeping your topics to 3-4 similar topics for best results. If you add a topic unrelated to the others, results will decrease as it’s hard to find influencers that are relevant to diverse topics!',
                },
                {
                    title: 'Keywords',
                    description:
                        'We look at Youtube video transcripts and post descriptions for recent videos to find influencers talking about your keyword. This is a great way to broaden your search, and include influencers with a recent interest in your keyword alongside the results from your topic search. Try to think of a phrase, or buzzword that influencers you’re looking for would use in the video as we are examining their transcripts!',
                },
                {
                    title: 'Hashtags',
                    description:
                        'Hashtags are how we recommend broadening your searches on Instagram and TikTok. By adding hashtags into your search, we will show you influencers who have used these hashtags in their last 100 posts alongside the results from your topic search. You can include multiple hashtags to really broaden your results, however sometimes influencers will include hashtags that aren’t actually related to their content.',
                },
                {
                    title: 'Filter by Influencer and Audience',
                    description:
                        'These filters are used to limit the results you see to your target niche. You can target an audience or influencer location based on what markets you are looking to generate sales, or develop brand awareness. We recommend setting the audience location to greater than 30% in the market you’re looking to generate sales in. Try focusing on microinfluencer for better ROI by limiting the followers from 10k - 1m.',
                },
                {
                    title: 'Engagement Rate',
                    description:
                        'The formula for calculating engagement rate may vary across the industry as there isn’t one recognized way to calculate it. At relay.club we divide Average Likes for the last 30 posts by the total number of followers.',
                },
                {
                    title: 'Contact Info',
                    description:
                        'To find the contact information for an influencer account, we need to scrape their information from their profile. Many influencers choose not to put this information in their profile, and so we aren’t able to collect it. We are working on new ways to collect this information, but for now showing only results with email available will be a much smaller pool of influencers than without.',
                },
            ],
        },
        campaigns: {
            title: 'Campaigns',
            url: '/campaigns',
            sections: [
                {
                    title: 'Tracking your outreach',
                    description:
                        'Once you add an influencer to your campaigns, move them through the influencer outreach funnel. You will first see anyone you added in “to contact” - once you’ve emailed or reached out, change their status to “contacted” and we’ll move them to the appropriate tab.',
                },
                {
                    title: '',
                    description:
                        'Set the status to “in progress” if the influencer has responded. Once you’ve negotiated a deal successfully they’re “confirmed”. Finally, after they’ve posted, you can change to “posted” and remember to add the post link so we can track the engagements for you!',
                },
                {
                    title: '',
                    description:
                        'Sometimes it just doesn’t work out, change status to “ignored” if an influencer hasn’t responded to you after a few weeks, or “rejected” if they don’t think it’s a good fit.',
                },
            ],
        },
        performance: {
            title: 'Performance',
            url: '/performance',
            sections: [
                {
                    title: 'You provide the link, we’ll handle the tracking ',
                    description:
                        'Once the influencer has posted, click on the “Content” button in the campaign table under the ‘Posted’ tab to add the post directly to your campaign. From there, we will start tracking the overall views, likes, and comments. You can check out your company’s overall performance by clicking “Performance” on the left side of your dashboard. Here you will see overall posts, and a summary of total views, likes, comments, and sales.',
                },
            ],
        },
        account: {
            title: 'My Account',
            url: '/account',
            sections: [
                {
                    title: 'Manage your teams efforts',
                    description:
                        'The ‘My Account’ section is there to keep track of the details for you. See which team members are signed up on relay.club, how many Searches and Influencer Reports you’ve opened so far this month, and how many you have left. If you find you’re running out too quickly, get in touch with our sales team to upgrade your account!',
                },
            ],
        },
        aiEmailGenerator: {
            title: 'AI Email',
            url: '/ai-email-generator',
            sections: [
                {
                    title: 'Leverage the power of AI in your outreach',
                    description:
                        'We’ve incorporated OpenAI technology into our email template generator. Just provide the information in the form and we’ll create a high conversion email and subject line for you that incorporates both your product information and details from the influencers account to make your emails stand out from the crowd.',
                },
            ],
        },
    },
};

export default guidePage;
