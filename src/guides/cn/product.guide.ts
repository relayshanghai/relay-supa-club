import { type DriveStep } from 'driver.js';

export const productGuideCn: DriveStep[] = [
    {
        element: '#product-page',
        popover: {
            title: '您的产品列表',
            description: `在此添加您的产品。您可以自定义编辑和添加您的产品，以便将产品添加到您的邮件模板中。`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#add-product-button',
        popover: {
            title: '添加产品',
            description: `单击此按钮开始添加产品详细信息。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#product-list',
        popover: {
            title: '产品列表',
            description: `为您的序列创建邮件时，将使用您的产品信息`,
            side: 'top',
            align: 'start',
        },
    },
];

export const productFormCn: DriveStep[] = [
    {
        element: '#product-form-modal',
        popover: {
            title: '填写您的产品详细信息',
            description: `向红人介绍更多关于产品的细节。`,
            side: 'top',
            align: 'start',
        },
    },
];
