const sequences = {
    sequences: 'Sequences',
    subtitle:
        'Sets of email templates that we will customize, schedule, and send to influencers to maximize your outreach conversion.',
    updateTemplateVariables: 'View sequence templates',
    needsAttention: 'Needs attention',
    autoStart: 'Auto-start',
    inSequence: 'In sequence',
    ignored: 'Ignored',
    totalInfluencers: 'Total influencers',
    influencerDeleted: 'Influencer(s) successfully deleted from sequence',
    influencerDeleteFailed: 'Failed to delete influencer(s) from sequence',
    openRate: 'Open rate',
    replyRate: 'Reply rate',
    bounceRate: 'Bounce rate',
    totalInfluencersTooltip: 'Total influencers',
    totalInfluencersTooltipDescription:
        'This is all influencers you have added to this sequence, including Needs attention, In sequence, and Ignored.',
    openRateTooltip: 'Open rate',
    sequenceSendTooltip: 'Sequence send',
    sequenceSendTooltipDescription: 'This will schedule to send your sequence emails for this influencer.',
    outreachPlanUpgradeTooltip: 'Only available on Outreach plan',
    outreachPlanUpgradeTooltipDescription:
        'This feature is only available for users currently on an Outreach plan. If you’d like access to our automated emails, intelligent templates, the Influencer Manager and our custom in-platform email inbox please reach out to our sales manager Amy on WeChat or at amy.hu@relay.club',
    openRateTooltipDescription:
        'The percentage of emails sent that get opened. Due to some email clients disabling external tracking, this number may not be 100% accurate',
    replyRateTooltip: 'Reply rate',
    replyRateTooltipDescription: 'The percentage of emails sent that get replied to.',
    bounceRateTooltip: 'Bounce rate',
    bounceRateTooltipDescription:
        'The percentage of emails sent that get returned due to incorrect mailing address or other reasons.',
    autoStartTooltip: 'Auto-start',
    autoStartTooltipDescription:
        'When this setting is enabled, any influencers added to the sequence with an email available will automatically have their sequence emails scheduled without you taking further action.',
    columns: {
        name: 'Name',
        email: 'Email',
        influencerTopics: 'Influencer topics',
        dateAdded: 'Date added',
        sequenceActions: 'Sequence actions',
        currentStep: 'Current step',
        status: 'Status',
        sendTime: 'Send time',
        nextEmailPreview: 'Next email preview',
        lastEmailSent: 'Last email sent',
        restartSequence: 'Restart sequence',
    },
    steps: {
        filter: 'Filter by current step',
        Outreach: 'Outreach',
        '1st Follow-up': '1st Follow-up',
        '2nd Follow-up': '2nd Follow-up',
        '3rd Follow-up': '3rd Follow-up',
        '4th Follow-up': '4th Follow-up',
    },
    status: {
        Scheduled: 'Scheduled',
        Delivered: 'Delivered',
        Bounced: 'Bounced',
        Opened: 'Opened',
        Replied: 'Replied',
        'Link Clicked': 'Link Clicked',
        Failed: 'Failed',
    },
    addEmail: 'Add email',
    newSequence: 'New sequence',
    indexColumns: {
        sequence: 'Sequence',
        influencers: 'Influencers',
        openRate: 'Open rate',
        manager: 'Manager',
        product: 'Product',
        sequenceActions: 'Sequence actions',
    },
    sequenceModal: 'Create a new sequence',
    sequenceInfo: 'Sequence Info',
    sequenceName: 'Sequence Name',
    product: 'Product',
    outreachEmail: 'Outreach Email',
    sequenceNamePlaceholder: 'Enter a name for your sequence',
    createNewSequence: 'Create new sequence',
    templateVariablesModalTitle: 'Set Template Variables',
    cancel: 'Cancel',
    createSequenceSuccess: 'Create successfully',
    createSequenceError: 'Failed to create sequence, please try again later',
    templateVariablesModalSubtitle:
        'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
    updateVariables: 'Update variables',
    templateVariablesUpdated: 'Template variables updated',
    templateVariablesUpdateError: 'Error updating template variables',
    company: 'Company',
    brandName: 'Brand Name',
    brandNamePlaceholder: 'Xiaomi',
    brandNameTooltip: `Brand Name`,
    brandNameTooltipDescription: `Enter the English name of your brand properly formatted.
        * We will include this value as is in your email templates.`,
    marketingManagerName: 'Manager English Name',
    marketingManagerNamePlaceholder: 'Vivian',
    marketingManagerNameTooltip: `Manager English Name`,
    marketingManagerNameTooltipDescription: `Enter the English name you would like to use for your outreach.
        * We will include this value as is in your email templates`,
    productName: 'Product Name',
    productNamePlaceholder: 'Mi Band 8',
    productNameTooltip: `Product Name`,
    productNameTooltipDescription: `Enter the English name of your product
    properly formatted.
    * We will include this value as is in your
    email templates`,
    productLink: 'Product Link',
    productLinkPlaceholder: 'www.taobao.com/miband8',
    productLinkTooltip: `Product Link`,
    productLinkTooltipDescription: `Enter a link to your website product
    page, or to your Amazon or Shopify
    store.
    * We will include this value as is in your
    email templates`,
    productDescription: 'Product Description',
    productDescriptionPlaceholder: `The Mi Band 8 is our latest affordable smart watch and fitness tracker.`,
    productDescriptionTooltip: `Product Description`,
    productDescriptionTooltipDescription: `Enter a short, clear, natural language description of
    your product. Try to keep it simple. You'll get better
    responses if people can easily understand your
    product!Start your description with "The [Product Name ] is "
    eg.
    Mi Band 8
    "The Mi Band 8 is our latest affordable smart watch and fitness tracker."
    * We will include this value as is in your email templates`,
    productPrice: 'Product Price',
    productPriceTooltip: 'Product Price',
    productPriceTooltipDescription: `Enter the price of your product in USD. It's better to enter as a whole number to keep your templates cleaner.
    * We will format this value with a $ in your email templates`,
    productPricePlaceholder: '99.9',
    influencer: 'Influencer',
    influencerNiche: 'Influencer Niche',
    influencerNichePlaceholder: 'Productivity Hackers',
    influencerNicheTooltip: `Influencer Niche`,
    influencerNicheTooltipDescription: `Enter the 'niche' or category of
    influencer you're targeting with in this
    sequence. eg.
    “Health and Wellness”, “Tech Reviewer”
     or “Fitness”* We will include this value as is in your
    email templates`,
    influencerAccountName: 'Influencer Name (or Handle)',
    influencerAccountNamePlaceholder: 'John Smith',
    influencerAccountNameTooltip: `Influencer Name (or Handle)`,
    influencerAccountNameTooltipDescription: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipeient!`,
    recentPostTitle: 'Influencer Recent Post',
    recentPostTitleTooltip: `Influencer Recent Post`,
    recentPostTitleTooltipDescription: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipient!`,
    wellHandleThisOne: `We'll handle this one!`,
    missingRequiredTemplateVariables: 'Missing required template variables',
    missingRequiredTemplateVariables_variables: 'Missing required template variables: {{variables}}',
    emailPreview: 'Email preview',
    number_emailsSuccessfullyScheduled: '{{number}} emails successfully scheduled to send',
    number_emailsFailedToSchedule: 'Failed to submit {{number}} emails to send',
    delete: {
        deleteSequence_name: 'Delete {{name}}?',
        deleteSequenceDescription:
            'Deleting a sequence will stop all scheduled emails for influencers in this sequence. No further messages will be sent. Influencers who have replied and are already in your Influencer Manager will be preserved, however any influencers currently in "Needs Attention", "In Sequence" or "Ignored" will be deleted. Are you sure you want to delete your sequence?',
        okaySequence: 'Yes. Delete this sequence',
        title: 'Delete influencer from sequence?',
        description:
            "Deleting the influencer will remove them from the sequence, and cancel any future messages. You'll have to re-add them if you change your mind.",
        cancel: 'Cancel',
        okay: 'Yes, delete them',
    },
    influencerAlreadyAdded_sequence: 'Influencer has already been added to sequence: {{sequence}} ',
    deleteConfirm: 'Are you sure you want to delete?',
    deleteSuccess: 'Successfully deleted.',
    deleteFail: 'Failed to delete.',
    emailAlreadyExists: 'Email already exists',
    invalidSocialProfileTooltip: 'Updating influencer report',
    invalidSocialProfileTooltipDescription:
        'Getting latest data for this influencer, we should be finished in 15 minutes.',
    invalidSocialProfileTooltipHighlight: 'Please wait and try again later.',
};

export default sequences;
