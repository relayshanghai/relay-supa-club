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
];
