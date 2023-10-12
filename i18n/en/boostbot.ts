const boostbot = {
    filters: {
        modalTitle: 'Basic Filters',
        fromPlatform: 'Show me influencers from',
        fromGeos: 'who have followers in',
        addMoreGeos: 'Add more',
        selectGeo: 'Select a location',
        advancedFilters: 'Advanced Filters',
        advancedFiltersTooltip: 'This feature is not yet available',
        updateFilters: 'Update',
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
        unlockSelected: 'Unlock selected influencers',
        outreachSelected: 'Add selected influencers to Sequence',
        progress: {
            step1: 'Generating topics and niches',
            step2: 'Browsing through millions of influencers in our database',
            step2B: 'Several thousand influencers found',
            step3: 'Handpicking the best influencers based on followers, engagements, location, etc.',
            step3B: '{{count}} influencers selected',
        },
        unlockDone: `Great. You've unlocked {{count}} new influencers. You can unlock up to 50 influencers under your free trial, or <customLink>upgrade for more</customLink>.

Tip: You can also unlock influencers one by one.`,
        outreachDone:
            "Great. I'm sending the selected influencers to your Sequence now. You may check the status here:",
        hasUsedUnlock: 'Awesome. You just unlocked {{count}} new influencers.',
        and: 'and',
    },
    table: {
        account: 'Account',
        topPosts: 'Top Posts',
        email: 'Email',
        unlockInfluencer: 'Unlock influencer',
        noResults: 'No results',
        pagination: 'Page {{current}} of {{total}}',
        selectAll: 'Select all',
        selectInfluencer: 'Select influencer',
        selectedAmount: '{{selectedCount}} of {{total}} influencer(s) selected.',
    },
    success: {
        influencersToOutreach: 'Influencers successfully added to outreach!',
    },
    error: {
        influencerSearch: 'Error fetching BoostBot influencers',
        influencerUnlock: 'Unlocking influencer failed',
        influencersToOutreach: 'Adding influencers to outreach failed',
        outOfSearchCredits: `Oh no. It looks like we've used up all your search credits. Please <customLink>upgrade to a subscription</customLink> so we can continue searching more.`,
        outOfProfileCredits: `Oh no. It looks like you've used up all your profile credits to unlock the influencers. Please <customLink>upgrade to a subscription</customLink> to unlock more.`,
        expiredAccount:
            'Oh no, it looks like your account has expired. Please <customLink>upgrade your account</customLink> to continue using BoostBot',
    },
};

export default boostbot;
