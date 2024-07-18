import { type DriveStep } from 'driver.js';

export const crmGuide: DriveStep[] = [
    {
        element: '#crm-new-sequence-button',
        popover: {
            title: 'Create a new sequence',
            description: `Create 'sequences' to organize and group creators selected from BoostBot AI Search or Classic Search. You can create as many sequences as you’d like. `,
            side: 'left',
            align: 'start',
        },
    },
];
