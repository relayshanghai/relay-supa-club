const creators = {
    recommended: 'Recommended',
    recommendedTooltip: 'Recommended Influencers',
    recommendedTooltipDetail:
        'Are those which have worked with boostbot.ai brands in the past and are known to be open to cooperation',
    loadMore: 'Load more',
    results: '{{ resultCount }} influencers matching your search and filters found.',
    noResults: 'No results found',
    reloadResult: 'Reload',
    addFilters: 'Add filters to tailor your results',
    searchResultError: 'Failed to fetch search results',
    clearFilter: 'Clear',
    failedToFetchReport: 'Failed to fetch report',
    retryLaterMessage: 'We are updating this influencer report. Please try again in 10-15 minutes',
    accountExpired: 'Your access period has ended. Please upgrade your account or subscribe to use this feature.',
    subscribers: 'Followers',
    avgViews: 'Avg. Views',
    actionButtons: 'Actions',
    engagements: 'Engagements',
    engagementRate: 'Engagement Rate',
    addToCampaign: 'Add to Campaign',
    analyzeProfile: 'Analyze',
    similarInfluencer: 'Find Similar',
    account: 'Account',
    searchTopicLabel: 'Search by Topics',
    searchTopic: 'Search for a topic',
    searchHashTagsLabel: 'Search by Hashtags',
    searchHashTags: 'Add hashtags',
    searchKeywordsLabel: 'Search by Key Phrase',
    searchKeywords: 'Add a keyword or phrase',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    openLink: 'Open Social Link',
    openProfile: 'Open Profile',
    close: 'Close',
    usageExceeded: 'Search limit exceeded',
    resultsPerPage: 'Results per page',
    addToSequence: 'Add to sequence',
    modal: {
        viewFullProfile: 'View Full Profile',
    },
    filter: {
        title: 'Filter Influencers',
        intro: 'Narrow down to the ideal influencers for your brand!',
        choosePlatform: 'Choose your platform',
        influencerFilters: 'Influencer Filters',
        location: 'Location',
        subscribers: 'Subscribers',
        averageViews: 'Average Views',
        gender: 'Gender',
        language: 'Language',
        engagementRate: 'Engagement Rate',
        lastPost: 'Last Post',
        contactInformation: 'Contact Information',
        emailAvailable: 'Email is available',
        audienceFilter: 'Audience Filter',
        searchButton: 'Search Influencer',
        sectionSummary: 'Try starting with number of subscribers and audience filters narrowing your search',
        from: 'From',
        to: 'To',
        max: 'Max',
        any: 'Any',
        or: 'or',
        activeSearches: 'Current Search',
        limitLocations: 'You cannot select more than 3 locations',
        locationPlaceholder: 'Type in a location',
        categories: 'Topics',
        searchCategory: 'Search Topic',
        searchCategoryPlaceholder: 'Search Topic (in English)',
        popularTopics: 'Popular Searches',
        influencerLocation: 'Influencer Location',
        audienceLocation: 'Audience Location',
        categoriesDescr: 'Filter influencer by topic',
        influencerLocationDescr: 'Filter based on the location of the influencer',
        audienceLocationDescr: 'Filter based on where your primary audience is located',
        male: 'Male',
        female: 'Female',
        subs: 'Subs',
        avgViews: 'Avg. Views',
        engagement: 'Engagement',
        days: 'days',
        months: 'months',
        upgradeSubscriptionToSeeMore: 'Upgrade your subscription plan, to view more results.',
    },
    show: {
        lastUpdate: 'The report was last updated on',
        searchInfluencerPlaceholder: 'Search for Influencers Username eg. @mrbeast',
        noInfluencerSearchResults: `Sorry, we don't have a report for {{ username }} on {{ platform }}`,
        noSearchResults: 'No results found, please try another keyword',
        noTopicResults: {
            title: 'Sorry, no relevant topic found.',
            description:
                'Try deleting the last few letters of your current search, or typing only the first few letters of a new search and selecting one of the suggested topics',
        },
        pressEnterToSearch: 'Press enter to search',
        editProfile: 'Edit Profile',
        description: 'Description',
        campaigns: 'Campaigns',
        socialMedia: 'Social Media',
        noRegion: 'No Region Set Yet',
        hashtags: 'Hashtags',
        mentions: 'Mentions',
        addToCampaign: 'Add to Campaign',
        audienceInformation: 'Audience Information',
        audienceCountries: 'Audience Countries',
        audienceGender: 'Audience Gender',
        audienceBrands: 'Brand Affinity',
        audienceInterests: 'Interests',
        audienceEthnicity: 'Ethnicity',
        audienceAgeGroup: 'Audience Age Group',
        analyze: 'View',
        types: 'Types',
        recentPosts: 'Recent Posts',
        noInfo: 'No audience information',
        noRecent: 'No Recent Posts',
        username: 'Username',
        channelStats: 'Channel Stats',
        country: 'Country',
        city: 'City',
        followers: 'Followers',
        engagements: 'Engagements',
        engagementRate: 'Engagement (%)',
        avgComments: 'Avg. Comments',
        avg_comments: 'Avg. Comments',
        avgViews: 'Avg. Views',
        avg_views: 'Avg. Views',
        recentPostStats: 'Recent Posts',
        popularPostStats: 'Popular Posts',
        avgLikes: 'Avg. Likes',
        avg_likes: 'Avg. Likes',
        avgDislikes: 'Avg. Dislikes',
        avg_dislikes: 'Avg. Dislikes',
        totViews: 'Total Views',
        audienceStats: 'Audience Stats',
        audience_followers: 'By Followers',
        audience_commenters: 'By Commenters',
        audience_likers: 'By Likers',
        genders: 'Genders',
        ages: 'Ages',
        languages: 'Languages',
        countries: 'Countries',
        cities: 'Cities',
        similarAudienceInfluencers: 'Influencers with similar audience',
        seeMore: 'See More',
        seeLess: 'See Less',
        similarInfluencers: 'Similar Influencers',
        popularPosts: 'Popular Posts',
        copyLink: 'Copy Link',
        openLink: 'Open Link',
        commercialPosts: 'Commercial Posts',
        shares: 'Shares',
        likes: 'Likes',
        comments: 'Comments',
        views: 'Views',
        total_views: 'Total Views',
        generalOverview: 'General Overview',
        following: 'Following',
        total_likes: 'Total Likes',
        cpm: 'CPM',
        estFee: 'Est. Fee',
        creatorEconomics: 'Influencer Economics',
        socialLinks: 'Contact influencer',
        generateReport: 'Generating influencer Report. Please wait',
        refreshPage: 'Click here to refresh page',
        statsDescr: {
            avgViews: 'The average sum of views on the last 30 posts',
            avgComments: 'The average sum of comments on the last 30 posts',
            avgLikes: 'The average sum of likes on the last 30 posts',
            influencerLocation:
                'We determine influencer location by analyzing location tags, language, caption in recent posts and text in bio.',
            engRate: 'Avg Likes divided by followers',
            lookAlikes: 'Influencers who write about similar topics',
            genderSplit:
                'We determine this by analyzing the audiences profile pictures, name, profile description and selfies in recent posts',
            ageSplit:
                'We determine this by analyzing the audiences profile pictures, name, profile description and selfies in recent posts',
            audienceLocation: 'We determine this by analyzing location tags, text, bio and caption in recent posts',
            language: 'We determine this by analyzing texts in the recent posts',
        },
        audienceGenderAge: 'Audience gender by age',
        mass_followers: 'Mass Followers',
        suspicious: 'Suspicious',
        influencers: 'Influencers',
        real: 'Real',
    },
    errorComponent: {
        trialCreditExpired: 'No free trial credits remaining',
        creditExpired: 'No credits remaining',
        trialSubscriptionExpired: 'Free trial has ended',
        subscriptionExpired: 'Subscription period has ended',
        paidDescription: 'To discover more influencers you’ll need to upgrade your plan and get more searches',
        trialDescription: 'To discover more influencers you’ll need to upgrade your account to one of our paid plans',
        upgradeAccountButton: 'Upgrade my account',
    },
    cancel: 'Cancel',
    sequence: 'Sequence',
    campaign: 'Campaign',
    addToSequenceNotes: 'Influencers added here will show up in the ‘Needs Attention’ tab of your sequence.',
    addToSequenceNotes2: 'Visit your sequence after adding to start sending your outreach emails.',
    noSequence: 'No sequence created yet',
    noCampaign: 'No campaign created yet',
    addToSequenceSuccess: 'Influencer added to sequence successfully',
    addToSequenceError: 'Error adding influencer to sequence',
    noAudienceData: 'No audience location data available',
};

export default creators;
