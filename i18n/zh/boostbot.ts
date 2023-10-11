const boostbot = {
    filters: {
        // TODO: translations
        openModalButton: 'Filter influencers',
        modalTitle: '基础筛选条件',
        fromPlatform: '我想要看以下平台的红人',
        fromGeos: '他们的粉丝所在地区位于',
        addMoreGeos: '添加更多',
        selectGeo: '选择一个国家地区',
        advancedFilters: '高级筛选条件',
        advancedFiltersTooltip: '此功能尚不可用',
        updateFilters: '更新筛选条件',
        atLeast: '他们的粉丝中，至少需要有',
        inLocation: '位于 {{location}} 地区',
    },
    chat: {
        introMessage: `你好，我是雷宝 🙂

你可以使用任何语言向我描述你的产品, 我将根据产品描述向你推荐相关的网红达人帮你在YouTube、TikTok和Instagram上推广产品。

例如: “一款重量轻、可折叠的4K HDR迷你相机无人机”`,
        noInfluencersFound: '看上去好像没有符合目前设定的筛选条件的网红达人诶。你可在此处再次调整筛选条件:',
        influencersFound:
            '我精心挑选了{{count}} 位非常适合你产品描述的网红达人。他们的粉丝主要在{{geolocations}}。你也可以在此处更改目标地域：',
        influencersFoundAddToSequence:
            '你可以将这些网红达人添加到名为<customLink>Sequence</customLink>「邮件进程管理」的邮件列表中。「邮件进程管理」功能可以让你直接向网红达人发送电子邮件。',
        influencersFoundNextSteps: '你希望做什么呢？',
        sendPlaceholder: '请发送产品描述。',
        stop: '停止BoostBot搜索',
        stopped: 'Boostbot已停止搜索',
        unlockSelected: '解锁已选中的网红达人',
        outreachSelected: '将已选中的网红达人添加至邮件进程管理项目',
        progress: {
            step1: '生成话题和细分领域中',
            step2: '在数据库中浏览上亿名KOL信息中',
            step2B: '找到了上千名KOL',
            step3: '正在根据粉丝数、互动率、地域等维度精选最佳KOL',
            step3B: '已选定 {{count}} 名KOL',
        },
        unlockDone: `太棒了, 你刚刚解锁了新的红人 {{count}}, 在试用期间, 你最多可以解锁50位红人报告, 或者你也可以<customLink>升级方案解锁更多</customLink>。

小贴士：您也可以选择逐个解锁 KOL。`,
        outreachDone: '好的！我现在将选中的网红达人添加至你的邮件进程管理项目中。你可以在此处查看状态：',
        hasUsedUnlock: '真棒！你刚刚解锁了新的红人 {{count}}。',
        and: '和',
        // TODO: translations
        clearChatModal: {
            open: 'Clear chat history',
            title: 'Are you sure you want to clear your BoostBot chat history and influencer results?',
            confirm: 'Yes',
            cancel: 'Back',
        },
    },
    table: {
        account: '账号',
        topPosts: '热门发布帖子',
        email: '邮箱地址',
        unlockInfluencer: '解锁红人报告',
        noResults: '没有结果',
        pagination: '{{current}} / {{total}}',
        selectAll: '选定全部达人',
        selectInfluencer: '选定达人',
        selectedAmount: '从{{total}}位达人中选定{{selectedCount}}位',
    },
    success: {
        influencersToOutreach: '该红人已成功添加至联络列表’',
    },
    error: {
        influencerSearch: '通过Boostbot搜索红人时出错',
        influencerUnlock: '解锁红人报告失败',
        influencersToOutreach: '添加红人至联络列表失败',
        outOfSearchCredits:
            '很抱歉，你已达到解锁红人报告的限额，请<customLink>升级方案</customLink>，以便继续搜索更多内容。',
        outOfProfileCredits: '很抱歉，你已达到解锁红人报告的限额，请 <customLink>升级方案</customLink> 解锁更多。',
        expiredAccount:
            '哦，看起来你的帐户已经过期了。你可在升级帐户<customLink>后继续使用雷宝所提供的服务</customLink>。',
    },
};

export default boostbot;
