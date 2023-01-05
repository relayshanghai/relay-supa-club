const campaigns = {
    index: {
        title: '项目管理',
        status: {
            inProgress: '已开始',
            notStarted: '未开始',
            completed: '已完成',
            all: '全部'
        },
        createCampaign: '创建项目',
        noCampaigns: '您没有任何项目',
        noCampaignsAvailable: '哎呀！ 您没有可用的项目。',
        clickCreate: '单击此处创建项目',
        searchPlaceholder: '搜索项目...'
    },
    modal: {
        addToCampaign: '添加到项目',
        addThisInfluencer: '将KOL添加到您已有的项目',
        createCampaign: '或创建一个新的项目',
        search: '搜索',
        favorites: '资源库',
        searchByKeyword: '按名字搜索海外KOL',
        searchDescription: '您可以使用KOL姓名来搜索您的海外KOL。',
        noResults: '暂无搜索结果, 请尝试搜索KOL用户名 ',
        searchCTA: '访问我们的海外KOL模块以获得更高级的搜索功能',
        addFromFavorites: '从您的资源库中添加KOL',
        favoritesDescription: '在这里, 您可以直接从您的资源库中添加KOL。',
        outreach: 'KOL沟通',
        details: 'KOL信息',
        content: 'KOL信息',
        comments: '公司备注',
        viewProfile: '查看KOL',
        addedSuccessfully: 'KOL已成功添加到项目',
        deletedSuccessfully: 'KOL已从项目中删除'
    },
    creatorModal: {
        outreach: 'KOL沟通',
        details: 'KOL信息',
        content: 'KOL信息',
        outbox: '发件箱',
        comments: '内部沟通',
        commentsDescr:
            '备注部分可用于在内部与您的团队就此 KOL 进行沟通。 这只有您的团队可以看到, KOL 看不到。',
        outboxDescr: '发件箱可以查看和追踪给该KOL已发送邮件的详细信息和状态',
        viewProfile: '查看KOL',
        messagePlaceholder: '在这里写下您的信息',
        publicationDate: '发布日期',
        publicationDescr: '这是 KOL 发布项目内容的日期。 定期更新，让您的团队和您自己了解发布日期',
        payment: '支付信息',
        paymentDescr: '如果您与 KOL 协商好价格，请在此处记录价格和支付详情以便追踪。',
        kolRate: 'KOL 价格 (USD)',
        paymentStatus: '支付状态',
        paymentInformation: '支付信息',
        paidAmount: '已付款金额',
        sample: '样品',
        sampleDescr: '为了避免样品被发送到错误的地址等。跟踪样本状态和 KOL 的地址总是有用的。',
        kolAddress: 'KOL 收货地址',
        trackingDetails: '物流信息',
        sampleStatus: '样品发送状态',
        save: '保存',
        kolUpdated: 'KOL信息已更新',
        noConnectYet: '您尚未联系此 KOL',
        clickToConnect: '点击这里发送邮件!',
        noResponse: '还没有看到或回复您的电子邮件。',
        followUp: '单击此处发送后续电子邮件!',
        notInterested: 'KOL 对此项目不感兴趣。',
        dayLimit: '您只能每 24 小时向 KOL 发送一封邮件，以避免被识别为垃圾邮件',
        emailSent: '邮件发送成功。',
        sendNewMail: '发送新邮件',
        to: '收件人: ',
        from: '发件人 ',
        sentTag: '已发送',
        fullypaid: '全款已付',
        unpaid: '未付款',
        partiallypaid: '部分付款',
        sent: '已发货',
        unsent: '未发货',
        delivered: '已签收'
    },
    email: {
        dayLimit: '您只能每 24 小时向 KOL 发送一封邮件，以避免被识别为垃圾邮件',
        emailSent: '邮件发送成功。',
        sendEmail: '发送邮件',
        pickTemplate: '选择一个模板',
        pickTemplateDescr: '您可以选择我们精心编制的模板来联系您喜欢的 KOL 增加获得回复的机会',
        initialEmail: '首封邮件',
        followUpEmail: '跟进邮件',
        writeOwnMessage: '或者编写自己的模板',
        sendEmailError: '哎呀！出错了，请尝试再次发送。',
        sendAndGoToNext: '发送邮件并打开下一位KOL',
        sendToAll: '用当前模版发送给所有KOL'
    },
    show: {
        status: {
            'in progress': '已开始',
            'not started': '未开始',
            // eslint-disable-next-line quote-props
            completed: '已完成'
        },
        submitting: '提交中',
        creatorSearch: '搜索和添加KOL',
        searchForCreator: '搜索KOL',
        editCampaign: '编辑项目',
        promotionPlatforms: '推广平台',
        typeOfPromotion: '推广类型',
        productName: '产品名称',
        productLink: '产品链接',
        targetGeographic: '目标地区',
        tags: '标签',
        changeStatus: '修改状态',
        noImages: '还没上传媒体',
        budget: '预算',
        campaignBudget: '项目预算',
        numInfluencers: 'KOL数量',
        projectDescription: '项目描述',
        dates: '日期',
        closingOutreach: 'KOL 招募结束日期',
        campaignLaunch: '项目启动日期',
        campaignEnd: '项目结束日期',
        campaignMedia: '项目媒体',
        noKolYet: '您没有将任何 KOL 添加到您的项目中。',
        addKol: '点击添加KOL。',
        comments: '备注',
        contact: '发邮件',
        account: '账户',
        creatorStatus: '状态',
        addedBy: '添加人',
        nextPoint: '推进状态',
        paymentAmount: ' 应付金额',
        paidAmount: '已付金额',
        paymentStatus: '支付状态',
        sampleStatus: '样品发送状态',
        addActionPoint: '添加节点',
        notes: '备注',
        important: '重要',
        byKol: 'KOL消息',
        importantMessages: '重要消息',
        kolMessages: 'KOL 消息',
        activities: {
            creatorOutreach: 'KOL 招募',
            campaignInfo: '项目信息',
            campaignTracking: 'Campaign Tracking',
            outreach: {
                addNewCreator: '添加KOL',
                all: '全部',
                toContact: '待联系',
                contacted: '已联系',
                inProgress: '联系中',
                confirmed: '已确认',
                rejected: '已拒绝',
                ignored: '未回复',
                status: {
                    changeStatus: '修改状态',
                    'to contact': '待联系',
                    contacted: '已联系',
                    'in progress': '联系中',
                    confirmed: '已确认',
                    rejected: '已拒绝',
                    // eslint-disable-next-line quote-props
                    ignored: '未回复'
                }
            },
            info: {
                budget: '预算',
                campaignBudget: '项目预算',
                numInfluencers: 'KOL数量',
                projectDescription: '项目描述',
                dates: '日期',
                closingOutreach: 'KOL 招募结束日期',
                campaignLaunch: '项目启动日期',
                campaignEnd: '项目结束日期'
            }
        }
    },
    notes: {
        notes: '备注',
        submit: '提交'
    },
    form: {
        createCampaign: '创建项目',
        editCampaign: '保存项目',
        cancel: '取消',
        selectClientQuestion: '选择客户',
        selectClientDescription: '如果您要为客户设置广告项目，请从右侧选择客户',
        addNewClient: '添加新客户',
        nameQuestion: '项目名称',
        nameDescription: '请输入您的项目名称',
        productNameQuestion: '产品名称',
        productNameDescription: '产品名称是什么？',
        descriptionQuestion: '项目描述',
        descriptionDescription: '请介绍项目主要内容，以及您想通过这个项目实现什么目的',
        productLinkQuestion: '产品链接',
        productLinkDescription: '如果有，请添加关于产品介绍相关的的链接',
        mediaGalleryQuestion: '媒体库',
        mediaGalleryDescription: '请添加关于产品介绍的相关图片。 第一张图片将用作您的项目封面。',
        noMedia: '还没有上传媒体文件',
        uploadImage: '添加媒体',
        tagsQuestion: '标签',
        tagsDescription: '请选择几个关键词来描述您的项目和产品。',
        tagsPlaceholder: '请选择关键词标签',
        requirements: '要求',
        requirementsDescription: '您要求的其他信息，以帮助我们的系统为您的项目找到合适的KOL',
        targetQuestion: '目标地区',
        targetDescription: '请选择您的目标地理区域，以及您希望的广告覆盖范围。',
        targetPlaceholder: '请选择您的目标地理区域',
        budgetQuestion: '预算',
        budgetDescription: '您想为这个项目分配多少预算？',
        numInfluencerQuestion: 'KOL数量',
        numInfluencerDescription: '指定您想要联系的KOL数量',
        timelineQuestion: '项目时间',
        timelineDescription: '请指定您的项目启动日期',
        outreachEnd: 'KOL招募截止日期',
        campaignLaunch: '项目启动日期',
        campaignEnd: '项目结束日期',
        promotionQuestion: '推广类型',
        promotionDescription: '请说明您希望此活动的推广及KOL类型',
        platformQuestion: '推广平台',
        platformDescription: '请指定您要在哪些平台上进行宣传。',
        startDate: '起始日期',
        endDate: '结束日期',
        fileSizeError: '上传文件太大，每个文件请勿超过 5 Mb。',
        fileSizeErrorAlert: '上传文件太大，每个文件请勿超过 5 Mb。',
        successCreateMsg: '您已成功创建一个新项目!',
        successUpdateMsg: '您已成功更新项目信息!',
        dedicatedVideo: '专属广告',
        integratedVideo: '植入广告'
    }
};
export default campaigns;
