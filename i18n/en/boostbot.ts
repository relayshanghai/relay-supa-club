const boostbot = {
    chat: {
        introMessage: `Hi, I'm BoostBot 🙂

Please send me an English description of your product and I'll recommend influencers to promote it on social media.

For example: "IPL uses beams of light to target the pigment in the hair follicles, which then heats up to remove the hair"`,
        influencersFound:
            'I handpicked the {{count}} influencers who have the best chances of promoting your product and making sales. What would you like to do next?',
        sendPlaceholder: 'Send me a product description',
        stop: 'Stop BoostBot',
        stopped: 'BoostBot stopped',
        noInfluencersToUnlock: 'It looks like you already unlocked all influencers on the current page',
        unlockPage: 'Unlock influencers on current page',
        unlockPageShort: 'Unlock page',
        outreachPage: 'Email influencers on current page',
        outreachPageShort: 'Email page',
        progress: {
            step1: 'Generating topics and niches',
            step2: 'Browsing through millions of influencers in our database',
            step2B: 'Several thousand influencers found',
            step3: 'Handpicking the best influencers based on followers, engagements, location, etc.',
            step3B: '{{count}} influencers selected',
        },
        unlockDone: `Great. You've unlocked {{count}} new influencers. You can unlock up to 50 influencers under your free trial, or <pricingLink>upgrade for more</pricingLink>.

Tip: You can also unlock influencers one by one.`,
        outreachDone: `Great. I'm scheduling the emails now.

Tip: You can check the email status on “<sequencesLink>Outreach</sequencesLink>”`,
        hasUsedUnlock: 'Awesome. You just unlocked {{count}} new influencers.',
        hasUsedOutreach: `Great. I'm scheduling the emails now.

Tip: You can opt not to email some influencers by taking them out of the list.`,
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
        outOfSearchCredits: `Oh no. It looks like we've used up all your search credits. Please <pricingLink>upgrade to a subscription</pricingLink> so we can continue searching more.`,
        outOfProfileCredits: `Oh no. It looks like you've used up all your profile credits to unlock the influencers. Please <pricingLink>upgrade to a subscription</pricingLink> to unlock more.`,
    },
};

export default boostbot;
