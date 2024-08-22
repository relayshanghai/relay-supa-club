import { type DriveStep } from 'driver.js';

export const productGuideEn: DriveStep[] = [
    {
        element: '#product-page',
        popover: {
            title: 'List of your product',
            description: `Add your products here. You can customize and add your products to be added to the email template.`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#add-product-button',
        popover: {
            title: 'Add product',
            description: `Click this button to start adding details for your product`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#product-list',
        popover: {
            title: 'Product list',
            description: `Your products will be used while creating an email for your sequence`,
            side: 'top',
            align: 'start',
        },
    },
];

export const productFormEn: DriveStep[] = [
    {
        element: '#product-form-modal',
        popover: {
            title: 'Fill your product details',
            description: `Tell your creators more details about your product`,
            side: 'top',
            align: 'start',
        },
    },
];
