const tooltips = {
    searchTopics: {
        title: 'Search by Topics',
        description:
            'We analyze profile content over extended periods of time to determine the topics relevant to an influencer.',
        link: 'Read more',
        highlight: 'Can only use Search by Topics OR  a key phrase in a single search, not both.',
    },
    searchKeywords: {
        title: 'Search by Key Phrase',
        description:
            'Our AI algorithm searches through the video transcripts or post hashtags to find influencers who have talked about your keyword (or a similar phrase) in recent videos and posts.',
        link: 'Read more',
        highlight: 'Can only use Search by Topics OR a key phrase in a single search, not both',
    },
    searchHashTags: {
        title: 'Search by Hashtags',
        description: 'Will return influencers who have used your hashtags in their recent posts.',
        link: 'Read more',
        highlight: 'Can only use Search by Topics OR hashtags in a single search, not both.',
    },
    topicCloud: {
        title: 'TopicCloud',
        description:
            'The TopicCloud is generated using the first topic you enter. We use related topics to create the cloud, with topics more relevant to your original topic having a darker colour, and topics that are attached to more influencers are larger in size.',
    },
    boostBotFiltermicroinfluencer: {
        title: ' ',
        description:
            'Small influencers like this are perfect for paid content since they usually charge smaller fees and audiences trust them.',
    },
    boostBotFilternicheinfluencer: {
        title: ' ',
        description:
            'Mid sized influencers like this are perfect for product gifting, or affiliate marketing because it can be a win-win partnership.',
    },
    boostBotFiltermegainfluencer: {
        title: ' ',
        description:
            'Mega influencers are perfect when you have a developed brand and the budget to partner with them.\n* Not recommended for smaller brands, or those just starting out with Influencer Marketing.',
    },
    boostBotAudienceLocation: {
        title: ' ',
        description: 'We determine audience location by analyzing their comments, viewing habits and interactions.',
    },
    boostBotNiches: {
        title: 'Top Niches',
        description: 'Specific categories this influencers content tend to relate to.',
    },
    boostBotScore: {
        title: 'BoostBot Score',
        description:
            'This score rates influencers on their audience engagement, relevance to your search, and post history!',
    },
    boostBotGender: {
        title: 'Audience Gender',
        description:
            'A breakdown of the influencers audience by age and gender.\nPercentages are of the total audience.\neg.  “13% of the total audience that are 18-24yo males”',
    },
    boostBotAvgViews: {
        title: ' ',
        description: 'Average number of views per piece of content released in last 30 days',
    },
    boostBotFollowerGrowth: {
        title: ' ',
        description: 'Growth in followers over the last 3 months',
    },
    boostBotEngagementRate: {
        title: ' ',
        description: 'The percentage of the audience that has engaged with the influencers content in the last 30 days',
    },
    audienceGender: {
        title: ' ',
        description:
            'A breakdown of the influencers audience by age and gender.\nPercentages are of the total audience.\neg.  “13% of the total audience that are 18-24yo males”',
    },
    boostbotScore: {
        title: ' ',
        description:
            'This score rates influencers on their audience engagement, relevance to your search, and post history!',
    },
    audienceGeolocations: {
        title: ' ',
        description: 'We determine audience location by analyzing their comments, viewing habits and interactions.',
    },
};

export default tooltips;
