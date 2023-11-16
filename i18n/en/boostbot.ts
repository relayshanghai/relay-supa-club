const boostbot = {
    filters: {
        openModalButton: 'Filters',
        modalTitle: 'Basic Filters',
        fromPlatform: 'Show me influencers from',
        fromGeos: 'who have followers in',
        addMoreGeos: 'Add more',
        selectGeo: 'Select a location',
        advancedFilters: 'Advanced Filters',
        advancedFiltersTooltip: 'This feature is not yet available',
        updateFilters: 'Save and close',
        atLeast: 'at least',
        inLocation: 'of their followers must be in {{location}}',
    },
    chat: {
        introMessage: `Hi, I'm BoostBot 🙂

Please send me a description of your product - in any language - and I'll recommend influencers to promote it on YouTube, TikTok, and Instagram.

For example: “A lightweight and foldable mini camera drone with 4K HDR video”`,
        noInfluencersFound:
            "Hmm, I can't seem to find influencers under your selected filters. Please update them here:",
        influencersFound:
            'I handpicked {{count}} influencers who have the best chances of promoting your product and making sales. What would you like to do next?',
        influencersFoundFirstTime:
            'I handpicked {{count}} influencers who are perfect for your product description. Their followers are mainly in {{geolocations}}. You can change your target location here:',
        influencersFoundAddToSequence:
            'You may add these influencers to a mailing list called <customLink>Sequence</customLink>. Sequence allows you to email influencers directly.',
        influencersFoundNextSteps: 'What would you like to do?',
        sendPlaceholder: 'Send me a product description',
        stop: 'Stop BoostBot',
        stopped: 'BoostBot stopped',
        outreachSelected: 'Add selected influencers to Sequence',
        progress: {
            step1: 'Generating topics and niches',
            step2: 'Browsing through millions of influencers in our database',
            step2B: 'Several thousand influencers found',
            step3: 'Handpicking the best influencers based on followers, engagements, location, etc.',
            step3B: '{{count}} influencers selected',
        },
        outreachDone:
            "Great. I'm sending the selected influencers to your Sequence now. You may check the status here: <customLink>{{sequenceName}}</customLink>",
        and: 'and',
        clearChatModal: {
            open: 'Clear chat and filters',
            title: 'Are you sure you want to delete your BoostBot chat history, filters, and influencer results?',
            confirm: 'Yes',
            cancel: 'Back',
        },
    },
    table: {
        account: 'Account',
        score: 'BoostBot Score',
        followers: 'Followers',
        audienceGender: 'Audience Gender',
        audienceGeolocations: 'Audience Locations',
        noResults: 'No results',
        pagination: 'Page {{current}} of {{total}}',
        selectAll: 'Select all',
        selectInfluencer: 'Select influencer',
        selectedAmount: '{{selectedCount}} selected.',
        alreadyAddedToSequence: 'Already added to sequence',
    },
    success: {
        influencersToOutreach: 'Influencers successfully added to outreach!',
    },
    error: {
        influencerSearch: 'Error fetching BoostBot influencers',
        influencersToOutreach: 'Adding influencers to outreach failed',
        outOfSearchCredits: `Oh no. It looks like we've used up all your search credits. Please <customLink>upgrade to a subscription</customLink> so we can continue searching more.`,
        expiredAccount:
            'Oh no, it looks like your account has expired. Please <customLink>upgrade your account</customLink> to continue using BoostBot',
    },
    modal: {
        unlockDetailedReport: 'Unlock Detailed Analysis Report',
        topNiches: 'Top Niches',
        audienceEngagementStats: 'Audience Engagement Stats',
        audienceGender: 'Audience Gender',
        engagedAudience: 'Audience Engagement Rate',
        engagementRate: 'Engagement Rate',
        averageViews: 'Average Views',
        channelStats: 'Channel Stats',
        followersGrowth: 'Followers Growth',
        totalPosts: 'Total Posts',
        addToSequence: 'Add to Sequence',
        followers: 'Followers',
    },
};

export default boostbot;
