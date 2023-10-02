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
        influencersFound:
            'I handpicked {{count}} influencers who are perfect for your product description. Their followers are mainly in {{geolocations}}. You can change your target location here:',
        influencersFoundAddToSequence:
            'You may add these influencers to a mailing list called <customLink>Sequence</customLink>. Sequence allows you to email influencers directly.',
        influencersFoundNextSteps: 'What would you like to do?',
        sendPlaceholder: 'Send me a product description',
        stop: 'Stop BoostBot',
        stopped: 'BoostBot stopped',
        noInfluencersToUnlock: 'It looks like you already unlocked all influencers on the current page',
        unlockPage: 'Unlock selected influencers',
        unlockPageShort: 'Unlock page',
        outreachPage: 'Add selected influencers to Sequence',
        outreachPageShort: 'Email page',
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
    },
    table: {
        account: 'Account',
        topPosts: 'Top Posts',
        email: 'Email',
        unlockInfluencer: 'Unlock influencer',
        removeInfluencer: 'Remove influencer',
        noResults: 'No results',
        pagination: 'Page {{current}} of {{total}}',
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
    },
};

export default boostbot;
