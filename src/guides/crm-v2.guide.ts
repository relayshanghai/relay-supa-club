import { type DriveStep } from 'driver.js';

export const crmGuide: DriveStep[] = [
    {
        element: '#v2-crm-page',
        popover: {
            title: 'Welcome to our New CRM Page!',
            description: `Welcome to the new and improved Sequence page! We’ve redesigned it with a more intuitive layout, making it easier for you to navigate through sequences and email templates. Enjoy enhanced visibility, smoother transitions, and a cleaner design tailored to improve your overall experience. Dive in and explore the upgraded interface!`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-button',
        popover: {
            title: 'Manage template variables',
            description: `Manage the variables you will use in your email templates`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#template-library-button',
        popover: {
            title: 'Create your own email template',
            description: `Manage your email template from here.`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#create-campaign-button',
        popover: {
            title: 'Create campaign here',
            description: `When your template is ready, start to create your campaign!`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#banner-button',
        popover: {
            title: 'Create a new sequence',
            description: `Currently you can still manage the sequences using the old view, just click the button and this whole thing will switch back to the old one!`,
            side: 'left',
            align: 'start',
        },
    },
];

export const templateVariableModal: DriveStep[] = [
    {
        element: '#template-variable-modal',
        popover: {
            title: 'Create new variables',
            description: `Create new variables that can be used when sending emails to creators. Choose what variables you use when creating the template.`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-category-input',
        popover: {
            title: 'Select variable categories',
            description: `These are available categories for the variables.`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-name-input',
        popover: {
            title: 'Name your variable',
            description: `Name the variable but make sure the name only contains letters or numbers!`,
            side: 'top',
            align: 'start',
        },
    },
];

export const templateLibraryModal: DriveStep[] = [
    {
        element: '#start-new-email-template',
        popover: {
            title: 'Create new email template',
            description: `Start creating your email templates with this button`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#list-created-email-template',
        popover: {
            title: 'List of create templates',
            description: `See the list of the created templates based on each step`,
            side: 'top',
            align: 'start',
        },
    },
];

export const templateLibraryWizardStep1: DriveStep[] = [
    {
        element: '#step1-template-wizard',
        popover: {
            title: 'Email template wizard',
            description: `This wizard will guide you to create an email template`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#variable-list-template-wizard',
        popover: {
            title: 'List of create variables',
            description: `Your created variables will appear here!`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-step-options',
        popover: {
            title: 'Step option',
            description: `Choose which step you want this email template to be sent out at.`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-step-subject',
        popover: {
            title: 'Place an email subject',
            description: `Type the subject for your email. You can also add the variables here by clicking the variable on the left side.`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-content',
        popover: {
            title: 'Create email template content',
            description: `Type whatever you want with every language you’re using. Feel free to add the variable to the editor by clicking the variable on the left side`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-finish-button',
        popover: {
            title: 'Finish create an email template',
            description: `if you have the confidence to continue, click here`,
            side: 'left',
            align: 'start',
        },
    },
];

export const templateLibraryWizardStep2: DriveStep[] = [
    {
        element: '#step2-template-wizard',
        popover: {
            title: 'Give your template a name',
            description: `Name and describe your current template`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step2-finish-button',
        popover: {
            title: 'Save your template',
            description: `When finished, click this button to save your template`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep1: DriveStep[] = [
    {
        element: '#step1-campaign-wizard',
        popover: {
            title: 'Create a new campaign',
            description: `This wizard will guide you on how to create an email sequence to your creators using the templates you created!`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step1-next-button',
        popover: {
            title: 'Choose template',
            description: `You will see a list of templates you created, grouped by sequence steps. Click and start to create a new sequence. One email sequence consists of three steps, so you must add one template per step to continue to the next step.`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep2: DriveStep[] = [
    {
        element: '#step2-campaign-wizard',
        popover: {
            title: 'Create a new campaign',
            description: `Name your sequence and chose your product!`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step2-next-button',
        popover: {
            title: 'Choose template',
            description: `when you are ready to the next step, click here`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep3: DriveStep[] = [
    {
        element: '#step3-campaign-wizard',
        popover: {
            title: 'Give values to the variables',
            description: `Configure the variables here. Every input you fill will substitute the variable when sending it to the influencers. Cool right?`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step3-steps-tab',
        popover: {
            title: 'Variables for all steps',
            description: `These variables will apply across all email sequence steps`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step3-next-button',
        popover: {
            title: 'Finish create a campaign',
            description: `If you finish configuring the variable values, click here`,
            side: 'left',
            align: 'start',
        },
    },
];
