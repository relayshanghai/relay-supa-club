const boostbot = {
    filters: {
        openModalButton: 'Filters',
        modalTitle: 'Set BoostBot Search Filters',
        modalTitleSubtitle: 'Setting these filters will help you focus BoostBot’s recommendations',
        fromPlatform: 'Social Media Platforms',
        audienceLocation: 'Audience Locations',
        addMoreGeos: 'Add more',
        selectGeo: 'Select a location',
        influencerSize: 'Influencer Size',
        advancedFiltersTooltip: 'This feature is not yet available',
        updateFilters: 'Save and close',
        addUpLocation: 'Add up to 2 locations to target',
        inLocation: 'of their followers must be in {{location}}',
        platformSub: {
            youtube: 'Long-lasting content',
            instagram: 'Great for brand building',
            tiktok: 'High content virality',
        },
        influencerSub: {
            microinfluencer: { title: 'Micro-influencer', subtitle: 'Authentic Engagement' },
            nicheinfluencer: { title: 'Niche-influencer', subtitle: 'Specialized Reach' },
            megainfluencer: { title: 'Mega-influencer', subtitle: 'Massive Audience' },
        },
    },
    chat: {
        title: 'BoostBot AI Search',
        introMessage: `Hey {{ username }}, what are we trying to sell today? 😄`,
        introMessageFirstTimeA: `Hi I'm BoostBot, your AI Influencer Marketing Assistant! 😄`,
        introMessageFirstTimeB: `Describe your product or brand for me below and I'll work my magic to find you great influencers to collab with.`,
        introMessageFirstTimeC: `Right now, I'm set up to focus on influencers from YouTube, TikTok, and Instagram with an audience in the US and Canada.

You can change that in the 'Filters' section at the top 👆🏻 if you're looking to boost sales elsewhere though!`,
        noInfluencersFound: "Hmm, I can't seem to find influencers under your selected filters.",
        influencersFound:
            'After you add your favourites to a sequence, let me know if you want to do another search 😄',
        influencersFoundFirstTimeA:
            "Select the influencers you you'd like to collab with from the results and add them to a sequence to unlock their full profile and contact info.",
        influencersFoundFirstTimeB: `BoostBot Pro Tip:

Cast a wide net, then spend your time vetting the responders!

Since most influencers you reach out to probably won't respond to you, you'll save yourself a ton of time if you contact lots of potential influencers, and only spend time carefully considering them if they actually reply!`,
        sendPlaceholder: 'Send me a product description',
        stop: 'Stop BoostBot',
        stopped: 'BoostBot stopped',
        outreachSelected: 'Add selected influencers to Sequence',
        progress: {
            step1: 'Finding niches for your product',
            step2: 'Searching our database for relevant influencers',
            step2B: 'Selected influencers with content related to those niches.',
            step3: 'Narrowing those results down according to your filters',
            step3B: "Found {{count}} influencers I think you'll be happy with!",
        },
        outreachDoneA: `Done!

You can check them out here <customLink>{{sequenceName}}</customLink>`,
        outreachDoneB: 'Change up your description to help me think of different influencers to recommend!',
        outreachDoneFirstTime: `Done!

You can check them out here <customLink>{{sequenceName}}</customLink>

Sequences are our email automation feature. You can set up your email templates, schedule your outreach and follow-up emails to make contacting influencers a breeze!`,
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
        noNichesFound: 'No niche data available for this influencer',
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
