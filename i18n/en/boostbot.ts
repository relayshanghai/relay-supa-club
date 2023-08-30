const boostbot = {
    chat: {
        introMessage: `Hi, I'm BoostBot 🙂

Please send me a description of your product and I'll recommend influencers to promote it on social media.

For example: "IPL uses beams of light to target the pigment in the hair follicles, which then heats up to remove the hair"`,
        influencersFoundA: 'I handpicked the',
        influencersFoundB:
            'influencers who have the best chances of promoting your product and making sales. What would you like to do next?',
        sendPlaceholder: 'Send me a product description',
        stop: 'Stop Boostbot',
        stopped: 'Boostbot stopped',
        unlockPage: 'Unlock influencers on current page',
        outreachPage: 'Email influencers on current page',
        progress: {
            step1: 'Generating topics and niches',
            step2: 'Browsing through millions of influencers in our database',
            step2B: 'Several thousand influencers found',
            step3: 'Handpicking the best influencers based on followers, engagements, location, etc.',
            step3B: 'influencers selected',
        },
    },
    table: {
        account: 'Account',
        topPosts: 'Top Posts',
        email: 'Email',
        unlockInfluencer: 'Unlock influencer',
        removeInfluencer: 'Remove influencer',
        noResults: 'No results',
    },
    success: {
        influencersToOutreach: 'Influencers successfully added to outreach!',
    },
    error: {
        influencerSearch: 'Error fetching Boostbot influencers',
        influencerUnlock: 'Unlocking influencer failed',
        influencersToOutreach: 'Adding influencers to outreach failed',
    },
};

export default boostbot;
