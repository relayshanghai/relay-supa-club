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

export const discoveryInfluencerGuide: DriveStep[] = [
    {
        element: '#sequence-creator-email',
        popover: {
            title: "Creator's email",
            description: `Easily access a creator's email address in your sequences, if their detailed analysis report includes one. From here, you can copy and paste the email into your own email system to contact the influencers directly.`,
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#sequence-send-button',
        popover: {
            title: 'Send Sequence',
            description: `Upgrade to Outreach for full CRM access which includes automated emailing to creators.`,
            side: 'bottom',
            align: 'start',
        },
    },
];

export const outreachInfluencerGuide: DriveStep[] = [
    {
        element: '#sequence-creator-email',
        popover: {
            title: "Creator's email",
            description: `Easily access a creator's email address in your sequences, if their detailed analysis report includes one.`,
            side: 'bottom',
            align: 'start',
        },
    },
    /**
        - Send up to 50 initial emails each day.
        - emails are scheduled CentralStandardTime 9am - 5pm Monday - Friday. We don’t send out emails on the weekend or after hours to increase the likelihood that creators will see and respond to your email.
        - Once the initial email is sent, you will see the creator in the “In sequence” section
        - If an influencer is in the “ignored” section, this means they didn’t respond to any of the emails and are likely uninterested at this time.
        - Click view sequence templates to update your email template.
     */
    {
        element: '#sequence-send-button',
        popover: {
            title: 'Send Sequence',
            description: `You can send the sequence to the Creator. You can send up to 50 initial emails each day. Emails are scheduled Central Standard Time 9am - 5pm Monday - Friday. We don’t send out emails on the weekend or after hours to increase the likelihood that creators will see and respond to your email.`,
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#tabs-buttons > button:nth-child(2)',
        popover: {
            title: 'In sequence creator',
            description: `Once the initial email is sent, you will see the creator in the “In sequence” section`,
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#tabs-buttons > button:nth-child(3)',
        popover: {
            title: 'Ignoring creator',
            description: `If an influencer is in the “ignored” section, this means they didn’t respond to any of the emails and are likely uninterested at this time.`,
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#sequence-email-template-button',
        popover: {
            title: 'Email Template',
            description: `Click view sequence templates to update your email template.`,
            side: 'bottom',
            align: 'start',
        },
    },
];

export const emailTemplateModal: DriveStep[] = [
    {
        element: '#email-templates-form',
        popover: {
            title: 'Customize email template',
            description: `Our templates customize each email to your creators for a special touch. All you need to do is input some basic information and we will do the rest.`,
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#email-template-product-description',
        popover: {
            title: 'Product description',
            description: `We recommend only writing 2-3 sentences as most in the Product Description section. If you put too much info at first, it can look spammy and influencers won’t want to respond.`,
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '#email-templates-preview',
        popover: {
            title: 'Initial Email',
            description: `For the initial email, you cannot cc or attach files. `,
            side: 'left',
            align: 'start',
        },
    },
];
