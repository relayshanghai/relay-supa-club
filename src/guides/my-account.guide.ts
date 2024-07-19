import { type DriveStep } from 'driver.js';

export const accountGuide: DriveStep[] = [
    {
        element: '#account-search-and-report',
        popover: {
            title: 'Report and Search Usages',
            description: 'You can monitor the searches and reports usages here.',
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '.account-payment-method-details',
        popover: {
            title: 'Payment Methods',
            description: 'You can add or change your payment methods here.',
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#account-receiving-info-email',
        popover: {
            title: 'Invoice Email',
            description: 'An invoice will be sent to this email address',
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#account-subaccount',
        popover: {
            title: 'Invite Your Colleagues',
            description: 'Add as many sub accounts to your BoostBot account as you want - it is free with any plan!',
            side: 'left',
            align: 'start',
        },
    },
];
