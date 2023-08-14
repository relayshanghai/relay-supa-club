const sequences = {
    sequences: '邮件进程管理',
    updateTemplateVariables: '更新邮模版件参数',
    needsAttention: '等待处理',
    inSequence: '序列中',
    ignored: '被忽略',
    totalInfluencers: 'KOL总数',
    openRate: '打开率',
    replyRate: '回复率',
    bounceRate: '退信率',
    totalInfluencersTooltip: 'Total influencers tooltip',
    openRateTooltip: 'Open rate tooltip',
    replyRateTooltip: 'Reply rate tooltip',
    bounceRateTooltip: 'Bounce rate tooltip',
    columns: {
        name: '姓名',
        email: '邮箱',
        influencerTopics: 'KOL主题',
        dateAdded: '添加日期',
        sequenceActions: '序列操作',
        currentStep: '当前步骤',
        status: '状态',
        sendTime: '发送时间',
        nextEmailPreview: '下一封邮件预览',
        lastEmailSent: '上一封邮件发送',
        restartSequence: '重新开始序列',
    },
    addEmail: '添加邮件',
    newSequence: '新建序列',
    indexColumns: {
        sequence: '项目',
        influencers: 'KOL总数',
        openRate: '打开率',
        manager: '项目负责人',
        product: '产品名称',
        sequenceActions: '项目操作',
    },
    sequenceModal: '创建新的邮件进程管理项目',
    sequenceInfo: '管理项目信息',
    sequenceName: '管理项目名称',
    product: '产品',
    outreachEmail: '外联邮件',
    sequenceNamePlaceholder: '为新建项目输入一个名称',
    createNewSequence: '创建',
    cancel: '取消',
    createSequenceSuccess: '创建成功',
    createSequenceError: '创建失败，请稍候重试',
    templateVariablesModalTitle: 'Template Variables',
    templateVariablesModalSubtitle:
        'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
    updateVariables: 'Update variables',
    templateVariablesUpdated: 'Template variables updated',
    templateVariablesUpdateError: 'Error updating template variables',
    company: 'Company',
    brandName: 'Brand Name',
    brandNameTooltip: `Enter the English name of your brand properly formatted.
        * We will include this value as is in your email templates.`,
    marketingManagerName: 'Marketing Manager Name',
    marketingManagerNameTooltip: `Enter the English name you would like to use for your outreach.
        * We will include this value as is in your email templates`,
    productName: 'Product Name',
    productNameTooltip: `Enter the English name of your product
    properly formatted.
    * We will include this value as is in your
    email templates`,
    productLink: 'Product Link',
    productLinkTooltip: `Enter a link to your website product
    page, or to your Amazon or Shopify
    store.
    * We will include this value as is in your
    email templates`,
    productDescription: 'Product Description',
    productDescriptionTooltip: `Enter a short, clear, natural language description of
    your product. Try to keep it simple. You'll get better
    responses if people can easily understand your
    product!Start your description with "The [Product Name ] is "
    eg.
    Mi Band 8
    "The Mi Band 8 is our latest affordable smart watch and fitness tracker."
    * We will include this value as is in your email templates`,
    productFeatures: 'Product Features',
    productFeaturesTooltip: `Describe the most important, or most unique
    features your product offers to let the influencer
    know what sets your product apart.

    Remember, to write this in a way that is easily
    understandable by the influencer.
    Start with “It offers”, “It can”, or “With”

    eg. ”It offers a full-color touch display, sleep, exercise
      and blood oxygen tracking, and has a battery life  of over 2 weeks!”* We will include this value as is in your
    email templates`,
    influencer: 'Influencer',
    influencerNiche: 'Influencer Niche',
    influencerNicheTooltip: `Enter the 'niche' or category of
    influencer you're targeting with in this
    sequence. eg.
    “Health and Wellness”, “Tech Reviewer”
     or “Fitness”* We will include this value as is in your
    email templates`,
    influencerNameOrHandle: 'Influencer Name (or Handle)',
    influencerNameOrHandleTooltip: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipeient!`,
    recentVideoTitle: 'Recent Video Title',
    recentVideoTitleTooltip: `No need to enter this! We will pull this
    information from the influencers report
    to customize each email for it's recipeient!`,
    wellHandleThisOne: `We'll handle this one!`,
    missingRequiredTemplateVariables_variables: 'Missing required template variables: {{variables}}',
};
export default sequences;
