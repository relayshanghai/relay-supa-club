import { type DriveStep } from 'driver.js';

export const inboxGuideEn: DriveStep[] = [
    {
        element: '#inbox-thread-list',
        popover: {
            title: 'Thread List',
            description: 'Once a creator has responded, it will show up in your inbox.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#creator-profile-quick-notes',
        popover: {
            title: 'Quick Notes',
            description:
                'Add quick notes like the stage you are at in collaboration, the fee you agreed on, mailing address, etc. ',
            side: 'left',
            align: 'start',
        },
    },
];

export const openThreadReplyGuideEn: DriveStep[] = [
    {
        element: '#inbox-thread-reply-box',
        popover: {
            title: "Replying Creator's email",
            description: 'Feel free to cc other members of your team or add an attachment of up to 15MB.',
            side: 'right',
            align: 'start',
        },
    },
];
