const sequences = {
    sequences: '全部序列',
    updateTemplateVariables: '更新邮模版件参数',
    needsAttention: '等待处理',
    autoStart: '开启自动处理',
    inSequence: '序列中',
    ignored: '被忽略',
    totalInfluencers: 'KOL总数',
    openRate: '打开率',
    replyRate: '回复率',
    bounceRate: '退信率',
    totalInfluencersTooltip: 'KOL总数',
    totalInfluencersTooltipDescription:
        '这是您添加到邮件进程管理器的所有KOL数量，包括需要急需回复、联络中和未回复的KOL。',
    openRateTooltip: '邮件打开率',
    openRateTooltipDescription:
        '已发送的邮件中被打开查看邮件占比。由于某些电子邮件客户端禁用外部跟踪，这个数字可能不是百分之百的准确。',
    replyRateTooltip: '邮件回复率',
    replyRateTooltipDescription: '已发送邮件至获得回复的占比',
    bounceRateTooltip: '邮件退回率',
    bounceRateTooltipDescription: '由于邮寄地址不正确或其他原因被退回的邮件占比。',
    autoStartTooltip: '开启自动处理',
    autoStartTooltipDescription:
        '启用此设置后，任何已添加到邮件进程管理中并有电子邮件的KOL都将会自动发送电子邮件，您无需进行其他的操作。',
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
        sequence: '序列',
        influencers: 'KOL',
        openRate: '打开率',
        manager: '经理',
        product: '产品',
        sequenceActions: '序列操作',
    },
    sequenceModal: '创建新序列',
    sequenceInfo: '序列信息',
    sequenceName: '序列名称',
    product: '产品详情',
    outreachEmail: '外联邮件',
    sequenceNamePlaceholder: '输入序列名称',
    createNewSequence: '新建序列',
    templateVariablesModalTitle: '设置个性化邮件模版',
    templateVariablesModalSubtitle: '您在这里看到的设置将用于自动化定制的邮件内容中！',
    updateVariables: '更新定制内容',
    cancel: '取消',
    templateVariablesUpdated: 'Template variables updated',
    templateVariablesUpdateError: 'Error updating template variables',
    company: '公司详情',
    brandName: '品牌名称',
    brandNamePlaceholder: 'Xiaomi',
    brandNameTooltip: `品牌名称`,
    brandNameTooltipDescription: `输入您品牌的英文名称，请确保格式正确。
        这将会直接显示于您的电子邮件模版中。`,
    marketingManagerName: '项目负责人英文名',
    marketingManagerNamePlaceholder: 'Vivian',
    marketingManagerNameTooltip: `项目负责人英文名`,
    marketingManagerNameTooltipDescription: `输入您用于邮箱落款的英文名。
        这将会直接显示于您的电子邮件模版中。`,
    productName: '产品名称',
    productNamePlaceholder: 'Mi Band 8',
    productNameTooltip: `产品名称`,
    productNameTooltipDescription: `输入正确格式的产品英文名称。
        这将会直接显示于您的电子邮件模版中。`,
    productLink: '产品链接',
    productLinkPlaceholder: 'www.taobao.com/miband8',
    productLinkTooltip: `产品链接`,
    productLinkTooltipDescription: `输入您产品的独立站链接，或Amazon、Shopify 平台的链接。
        这将会直接显示于您的电子邮件模版中。`,
    productDescription: '产品描述',
    productDescriptionPlaceholder: `The Mi Band 8 is our latest affordable smart watch and fitness tracker.`,
    productDescriptionTooltip: `产品描述`,
    productDescriptionTooltipDescription: `输入简洁的产品描述，越简单清晰越好。
    以产品小米手环 8为例，
    产品名称：Mi Band 8
    产品介绍：“The Mi Band 8 is our latest affordable smart watch
    and fitness tracker.”
    这将会直接显示于您的电子邮件模版中。`,
    productFeatures: '产品亮点',
    productFeaturesPlaceholder: `It offers a full-color touch display,  sleep, exercise and blood oxygen tracking and has a battery life of over 2 weeks!`,
    productFeaturesTooltip: '产品亮点',
    productFeaturesTooltipDescription: `描述您的产品最重要或最亮点的功能，让KOL了解您的产品与众不同之处。
    描述您的产品最重要或最亮点的功能，让KOL了解您的产品与众不同之处。
    以 "It offers"、"It can "或 "With "开头。

    例如
    ”It offers a full-color touch display, sleep, exercise and blood oxygen tracking, and has a
    battery life of over 2 weeks!”
    这将会直接显示于您的电子邮件模版中。`,
    influencer: 'KOL',
    influencerNiche: 'KOL所在领域',
    influencerNichePlaceholder: 'Productivity Hackers',
    influencerNicheTooltip: 'KOL所在领域',
    influencerNicheTooltipDescription: `在邮件进程管理中输入您的目标领域或KOL类别。
    例如
    "Health and Wellness"、"Tech Reviewer "或 "Fitness"。
    这将会直接显示于您的电子邮件模版中。`,
    influencerNameOrHandle: 'KOL名字（或账号）',
    influencerNameOrHandleTooltip: `KOL名字（或账号）`,
    influencerNameOrHandleTooltipDescription: `无需输入！我们将从KOL报告中提取这些信息，为收件人定制每封邮件！`,
    recentVideoTitle: '最新发布内容',
    recentVideoTitleTooltip: '最新发布内容',
    recentVideoTitleTooltipDescription: `无需输入！我们将从KOL报告中提取这些信息，为收件人定制每封邮件！`,
    wellHandleThisOne: `无需输入此项，我们来搞定！`,
    missingRequiredTemplateVariables_variables: 'Missing required template variables: {{variables}}',
};
export default sequences;
