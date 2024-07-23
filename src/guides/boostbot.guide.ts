import { type DriveStep } from 'driver.js';

export const chatGuide: DriveStep[] = [
    {
        element: '#boostbot-chat-component',
        popover: {
            title: 'Welcome to BoostBot!',
            description:
                'Input your description here and BoostBot AI Search uses AI to provide a curated list of great creators. Designed for rapid influencer outreach, it delivers results—including creator email addresses—in under 2 minutes.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-open-filters',
        popover: {
            title: 'Filter your search',
            description:
                'Default filters target small to medium-sized creators in North America across Instagram, YouTube, and TikTok; adjust filters for other markets and platforms.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-chat-input',
        popover: {
            title: 'Type your search here',
            description:
                'For now, just type a product you want to promote. For example, "organic skincare" or "sustainable fashion".',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-send-message',
        popover: {
            title: 'Press this button',
            description: 'This button will makes us find influencers for you',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#birdeatsbug-sdk',
        popover: {
            title: 'Oh No, I found a bug!',
            description:
                'If you are experiencing a problem on BoostBot, click on Report a bug. This sends feedback to our tech team so we can fix it asap!',
            side: 'left',
            align: 'start',
        },
    },
];

export const influencerModalGuideAdditionForDiscovery: DriveStep[] = [
    {
        element: '#boostbot-influencer-table-checkbox',
        popover: {
            title: 'Select creators',
            description: 'Select the creators you want to add to your sequence in the CRM section.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-add-to-sequence-button',
        popover: {
            title: 'Add creator to sequence',
            description:
                'Click this button to add the selected creators to your sequence in the CRM section to view the creator’s email address.',
            side: 'right',
            align: 'start',
        },
    },
];

export const influencerModalGuideAdditionForOutreach: DriveStep[] = [
    {
        element: '#boostbot-influencer-table-checkbox',
        popover: {
            title: 'Select creators',
            description: 'Select the creators you want to add to your sequence in the CRM section.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-add-to-sequence-button',
        popover: {
            title: 'Add creator to sequence',
            description:
                'Click this button to add the selected creators to your sequence in the CRM section to start your influencer outreach.',
            side: 'right',
            align: 'start',
        },
    },
];

export const influencerListMiniReport: DriveStep[] = [
    {
        element: '#boostbot-creator-mini-report',
        popover: {
            title: "Creator's mini report",
            description:
                "Click here to open up a mini report that shows top niches, channel growth, etc - note, this is included in your plan and doesn't consume any audience reports.",
            side: 'right',
            align: 'start',
        },
    },
];

export const influencerListGuide: DriveStep[] = [
    {
        element: '#influencers-list',
        popover: {
            title: 'Searching list',
            description: 'This is the list of influencers that BoostBot found for you.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#boostbot-social-profile-link',
        popover: {
            title: "Creator's social media",
            description: 'Click here to go directly to the creator’s social media page.',
            side: 'right',
            align: 'start',
        },
    },
];

export const influencerModalGuide: DriveStep[] = [
    {
        element: '#boostbot-influencer-detailed-report-link',
        popover: {
            title: 'Report Details',
            description:
                'Click here to unlock a detailed analysis report that includes more info including similar influencers, more information on their followers, and more - note, unlocking a detailed analysis report consumers 1 audience report. ',
            side: 'right',
            align: 'start',
        },
    },
];
