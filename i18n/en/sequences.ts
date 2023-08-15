const sequences = {
    sequences: 'Sequences',
    updateTemplateVariables: 'Update template variables',
    needsAttention: 'Needs attention',
    autoStart: 'Auto-start',
    inSequence: 'In sequence',
    ignored: 'Ignored',
    totalInfluencers: 'Total influencers',
    openRate: 'Open rate',
    replyRate: 'Reply rate',
    bounceRate: 'Bounce rate',
    totalInfluencersTooltip: 'Total influencers',
    totalInfluencersTooltipDescription:
        'This is all influencers you have added to this sequence, including Needs attention, In sequence, and Ignored.',
    openRateTooltip: 'Open rate',
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
    productFeatures: 'Product Features',
    productFeaturesPlaceholder: `It offers a full-color touch display,  sleep, exercise and blood oxygen tracking and has a battery life of over 2 weeks!`,
    productFeaturesTooltip: `Product Features`,
    productFeaturesTooltipDescription: `Describe the most important, or most unique
    features your product offers to let the influencer
    know what sets your product apart.

    Remember, to write this in a way that is easily
    understandable by the influencer.
    Start with “It offers”, “It can”, or “With”

    eg. ”It offers a full-color touch display, sleep, exercise
      and blood oxygen tracking, and has a battery life  of over 2 weeks!”* We will include this value as is in your
    email templates`,
    productPrice: 'Product Price',
    productPriceTooltip: `Enter the price of your product in USD. It's better to enter as a whole number to keep your templates cleaner.
    * We will format this value with a $ in your email templates`,
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
    influencerNameOrHandle: 'Influencer Name (or Handle)',
    influencerNameOrHandlePlaceholder: 'John Smith',
    influencerNameOrHandleTooltip: `Influencer Name (or Handle)`,
    influencerNameOrHandleTooltipDescription: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipeient!`,
    recentVideoTitle: 'Influencer Recent Post',
    recentVideoTitleTooltip: `Influencer Recent Post`,
    recentVideoTitleTooltipDescription: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipient!`,
    wellHandleThisOne: `We'll handle this one!`,
    missingRequiredTemplateVariables_variables: 'Missing required template variables: {{variables}}',
    emailPreview: 'Email preview',
    emailsSentTo_number_influencers: 'Emails sent to {{number}} influencers',
    failedToSendTo_number_influencers: 'Failed to send to {{number}} influencers',
};

export default sequences;
