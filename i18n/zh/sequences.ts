const sequences = {
    sequences: '邮件进程管理',
    subtitle: '我们系统会将定制化的邮件模板定时发送给KOL，这个定制化的联络流程可以大大提升回复率。',
    updateTemplateVariables: '查看邮件进程模版',
    needsAttention: '等待处理',
    autoStart: '开启自动处理',
    inSequence: '序列中',
    ignored: '被忽略',
    unscheduled: '未安排',
    scheduledAndSent: '已安排且已发送',
    replied: '已回复',
    totalInfluencers: 'KOL总数',
    influencerDeleted: 'KOL已成功从序列中删除',
    influencerDeleteFailed: 'KOL从序列中删除失败',
    openRate: '打开率',
    replyRate: '回复率',
    bounceRate: '退信率',
    sequenceSendTooltip: '发送序列邮件',
    sequenceSendTooltipDescription: '这将会安排发送您的序列邮件给这位KOL。',
    sequenceBatchSendTooltipDescription: '这将会开始向所有选中的KOL发送序列邮件。可能需要几分钟才能完全完成。',
    totalInfluencersTooltip: 'KOL总数',
    totalInfluencersTooltipDescription:
        '这是您添加到邮件进程管理器的所有KOL数量，包括需要急需回复、联络中和未回复的KOL。',
    outreachPlanUpgradeTooltip: '仅限拓展方案用户使用',
    outreachPlanUpgradeTooltipDescription: `仅限拓展方案用户使用
    此功能仅适用于当前使用拓展方案的付费用户。如果您希望使用我们的邮件进程管理、智能邮件模板、KOL管理跟进以及定制的平台    内电子邮箱功能，请通过微信联系我们的销售经理雪菲,或加微信：xfsp1989咨询拓展方案。`,
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
    status: {
        Unscheduled: '未安排',
        Scheduled: '已计划',
        Delivered: '已送达',
        Opened: '已打开',
        'Link Clicked': '已点击',
        Bounced: '被退回',
        Failed: '发送失败',
        Replied: '已回复',
        Ignored: '被忽略',
    },
    indexColumns: {
        sequence: '项目',
        influencers: 'KOL总数',
        openRate: '打开率',
        manager: '项目负责人',
        product: '产品名称',
        sequenceActions: '项目操作',
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
    productPrice: '产品价格',
    productPriceTooltip: '产品价格',
    productPriceTooltipDescription: `
    以美元为单位输入产品价格。

    最好输入整数，以便让模板看起来更加简洁。

    这将会直接显示于您的电子邮件模版中，单位格式为 $。`,
    productPricePlaceholder: '99.9',
    influencer: 'KOL',
    influencerNiche: 'KOL所在领域',
    influencerNichePlaceholder: 'Productivity Hackers',
    influencerNicheTooltip: 'KOL所在领域',
    influencerNicheTooltipDescription: `在邮件进程管理中输入您的目标领域或KOL类别。
    例如
    "Health and Wellness"、"Tech Reviewer "或 "Fitness"。
    这将会直接显示于您的电子邮件模版中。`,
    influencerAccountName: 'KOL名字（或账号）',
    influencerAccountNameTooltip: `KOL名字（或账号）`,
    influencerAccountNameTooltipDescription: `无需输入！我们将从KOL报告中提取这些信息，为收件人定制每封邮件！`,
    recentPostTitle: '最新发布内容',
    recentPostTitleTooltip: '最新发布内容',
    recentPostTitleTooltipDescription: `无需输入！我们将从KOL报告中提取这些信息，为收件人定制每封邮件！`,
    wellHandleThisOne: `无需输入此项，我们来搞定！`,
    missingRequiredTemplateVariables: '缺少必填的邮件模版参数',
    missingRequiredTemplateVariables_variables: '缺少必填的邮件模版参数: {{variables}}',
    emailPreview: '邮件预览',
    number_emailsSuccessfullyScheduled: '成功提交安排{{number}}发送邮件',
    number_emailsFailedToSchedule: '失败提交安排发{{number}}送邮件',
    steps: {
        filter: '按KOL联络进展筛选',
        Outreach: '首封外联邮件',
        '1st Follow-up': '第一次跟进',
        '2nd Follow-up': '第二次跟进',
        '3rd Follow-up': '第三次跟进',
        '4th Follow-up': '第四次跟进',
    },
    delete: {
        deleteSequence_name: '删除 {{name}}?',
        deleteSequenceDescription:
            '删除邮件进程管理项目后，系统将不再向此项目中的KOL发送预定邮件。也不再发送任何进一步的信息。已回复且位于“KOL管理跟进“中的KOL将被保留，但处于“急需回复“、”联络中“或”未回复“阶段的KOL将被删除。确定要删除您的邮件进程管理项目吗？',
        okaySequence: '是的，删除此进程管理项目',
        title: '是否把KOL从此邮件进程管理项目中移除？',
        description:
            '此操作将把KOL从此邮件进程管理项目中移除，并不再向TA发送后续的信息。完成操作后如需要再次添加该KOL，须重新将TA添加至邮件进程管理项目中。',
        cancel: '取消',
        okay: '确认移除',
    },
    influencerAlreadyAdded_sequence: 'KOL已经添加到序列: {{sequence}}',
    deleteConfirm: '确认删除？',
    deleteSuccess: '删除成功',
    deleteFail: '删除失败',
    emailAlreadyExists: '邮箱已存在',
    invalidSocialProfileTooltip: '正在更新红人报告',
    invalidSocialProfileTooltipDescription: '正在获取该KOL的最新数据，请耐心等待，预计将在15分钟内完成。',
    invalidSocialProfileTooltipHighlight: '请稍后再试一次。',
    startSelectedSequences: '开始选中的序列',
    missingEmail: '缺少邮箱',
    missingEmailTooltipDescription: '您必须为此KOL添加电子邮件，以便开始此序列。',
    warningDuplicateInfluencer: '警告：重复的KOL可能会导致问题',
    sequenceScheduleFailed: '安排序列邮件失败，请稍后再试',
    reportServerBusy: '服务器正忙，请稍后再试',
    reportDoesnotExists: '哎呀！无法获取该邮件地址。请手动输入邮件地址以继续进行建联。',
    retryButton: '重试按钮',
    clickToRetry: '请单击以重新获取数据',
    limitExceeded:
        '哎呀！看起来您的雷宝BoostBot额度已经用完了！如果本月您还希望为您的帐户添加更多使用额度，请与销售团队的雪菲通过微信：xfsp1989取得联系。或者，您的使用额度将在下一个计费周期开始时自动续订。',
    account_removed: '此影响者已被所有者移除。',
    influencerLimit: `同一个序列中，最多只能添加{{ influencerLimit }}位红人。要添加更多红人，请创建一个新的序列。谢谢！`,
    table: {
        unscheduled: {
            name: "名称",
            viewCard: "查看卡片",
            influencerEmail: "影响者邮箱",
            influencerNiches: "影响者领域",
            dateAdded: "添加日期",
            action: "操作"
        },
        scheduled: {
            name: "名称",
            viewCard: "查看卡片",
            currentSequenceEmail: "当前序列邮件",
            currentStatus: "当前状态"
        },
        replied: {
            name: "名称",
            sequenceEmailRepliedTo: "回复的序列邮件",
            firstRepliedAt: "首次回复时间",
            viewInbox: "查看收件箱"
        },
        ignored: {
            name: "名称",
            firstEmailSentAt: "序列邮件被忽略",
            lastEmailSentAt: "首次忽略时间",
            action: "操作"
        }
        
    }
};
export default sequences;
