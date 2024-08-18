const campaigns = {
    index: {
        title: '项目管理',
        status: {
            inProgress: '已开始',
            notStarted: '未开始',
            completed: '已完成',
            all: '全部',
            archived: '已存档项目',
        },
        createCampaign: '创建项目',
        noCampaigns: '您没有任何项目',
        noCampaignsAvailable: '哎呀！ 您没有可用的项目。',
        clickCreate: '单击此处创建项目。',
        searchPlaceholder: '搜索项目...',
        archive: '存档',
        unarchive: '取消存档',
        edit: '修改',
        search: '搜索',
    },
    modal: {
        addToCampaign: '添加到项目',
        addThisInfluencer: '将KOL添加到您已有的项目',
        moveToCampaign: '移动到项目',
        moveThisInfluencer: '将KOL移动到您已有的项目',
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
        comments: '内部备注',
        viewProfile: '查看KOL',
        addedSuccessfully: 'KOL已成功添加到项目',
        deletedSuccessfully: 'KOL已从项目中删除',
        deleteConfirmation: '您确定要从项目中删除此KOL吗？',
        doNotAdd: '不添加',
        addAnyway: '继续添加',
        influencerAlreadyAdded: '这个KOL已被添加到其他活动:',
        movedSuccessfully: 'KOL已成功移动到项目',
    },
    creatorModal: {
        outreach: 'KOL沟通',
        details: 'KOL信息',
        content: 'KOL信息',
        outbox: '发件箱',
        comments: '内部沟通',
        commentsDescr: '备注部分可用于在内部与您的团队就此 KOL 进行沟通。 这只有您的团队可以看到, KOL 看不到。',
        outboxDescr: '发件箱可以查看和追踪给该KOL已发送邮件的详细信息和状态',
        viewProfile: '查看KOL',
        messagePlaceholder: '在这里写下您的信息',
        publicationDescr: '这是 KOL 发布项目内容的日期。 定期更新，让您的团队和您自己了解发布日期',
        payment: '支付信息',
        paymentDescr: '如果您与 KOL 协商好价格，请在此处记录价格和支付详情以便追踪。',
        paymentStatus: '支付状态',
        paidAmount: '已付款金额',
        sample: '样品',
        sampleDescr: '为了避免样品被发送到错误的地址等。跟踪样本状态和 KOL 的地址总是有用的。',
        trackingDetails: '物流信息',
        sampleStatus: '样品发送状态',
        save: '保存',
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
        delivered: '已签收',
        influencerUpdated: 'KOL信息已更新',
    },
    addSalesModal: {
        caption: '添加销售额',
        title: '添加销售额（美元）',
        currency: '$',
        modalButton: '添加金额',
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
        sendToAll: '用当前模版发送给所有KOL',
    },
    show: {
        viewContactInfo: '查看联系方式',
        status: {
            'in progress': '已开始',
            'not started': '未开始',
            // eslint-disable-next-line quote-props
            completed: '已完成',
        },
        archived: '项目已经成功存档',
        unarchived: '项目已经成功取消存档',
        submitting: '提交中',
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
        addPaymentInfo: '添加支付信息',
        comments: '备注',
        contact: '联系方式',
        account: '账户',
        publicationDate: '发布日期',
        creatorStatus: '状态',
        addedBy: '添加人',
        nextPoint: '推进状态',
        selectDate: '选择日期',
        paymentInformation: '支付信息',
        paymentAmount: ' 应付金额',
        paidAmount: '已付金额',
        paymentStatus: '支付状态',
        influencerAddress: '收货地址',
        sampleStatus: '样品发送状态',
        addActionPoint: '添加节点',
        addAddress: '添加地址',
        notes: '备注',
        important: '重要',
        importantMessages: '重要消息',
        moveInfluencer: '移动KOL',
        moveInfluencerDescr: '将 KOL 移动到其他项目中。',
        influencerFee: 'KOL费用',
        manageInfluencer: '管理KOL',
        manageInfluencerDescr: '管理 KOL 的其他信息，包括联系方式、样品、邮件和付款信息等。',
        links: '帖子链接',
        sales: '销售',
        actions: '操作',
        content: '内容',
        activities: {
            influencerOutreach: 'KOL 招募',
            campaignInfo: '项目信息',
            campaignTracking: 'Campaign Tracking',
            outreach: {
                addNewInfluencer: '添加KOL',
                all: '全部',
                toContact: '待联系',
                contacted: '已联系',
                inProgress: '联系中',
                confirmed: '已确认',
                posted: '已发布',
                rejected: '已拒绝',
                ignored: '未回复',
                noInfluencers: '无KOL：搜索无结果',
            },
            info: {
                budget: '预算',
                campaignBudget: '项目预算',
                numInfluencers: 'KOL数量',
                projectDescription: '项目描述',
                dates: '日期',
                closingOutreach: 'KOL 招募结束日期',
                campaignLaunch: '项目启动日期',
                campaignEnd: '项目结束日期',
            },
        },
    },
    notes: {
        notes: '备注',
        submit: '提交',
        emptyComment: '请输入备注',
        deleteConfirmation: '您确定要删除此备注吗？',
        deletedSuccessfully: '备注已成功删除',
        updateSuccessfully: '备注已成功更新',
    },
    form: {
        createCampaign: '创建项目',
        saveCampaign: '保存项目',
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
        integratedVideo: '植入广告',
        oopsSomethingWrong: '哎呀，出错了！',
    },
    post: {
        title: '管理帖子',
        addPostUrl: '添加帖子网址',
        addAnotherPost: '添加另一个帖子',
        submit: '提交',
        invalidUrl: '无效的网址',
        duplicateUrl: '重复的网址',
        success: '成功添加 {{amount}} 个网址的帖子数据',
        failed: '无法获取 {{amount}} 个网址的帖子数据',
        currentPosts: '当前帖子',
        removedPost: '已删除帖子',
        errorRemovingPost: '删除帖子时出错',
    },
    manageInfluencer: {
        title: '管理KOL',
        influencerFee: 'KOL费用',
        sales: '销售',
        cancel: '取消',
        save: '保存',
        contactInfo: '联系方式',
        invalidDate: '无效的日期',
        invalidNumber: '无效的数字',
    },
    title: '标题',
    settings: '设置',
    createdAt: '创建于',
};
export default campaigns;
