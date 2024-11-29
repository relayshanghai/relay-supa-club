const boostbot = {
    filters: {
        openModalButton: '筛选红人',
        modalTitle: '设置筛选的条件',
        modalTitleSubtitle: '设置的筛选条件有助于让雷宝为您推荐关联度更高的红人',
        fromPlatform: '我想要看以下平台的红人',
        audienceLocation: '受众地区',
        fromGeos: '他们的粉丝所在地区位于',
        addMoreGeos: '添加更多',
        selectGeo: '选择一个国家地区',
        influencerSize: '红人量级',
        advancedFilters: '高级筛选条件',
        advancedFiltersTooltip: '此功能尚不可用',
        updateFilters: '更新筛选条件',
        addUpLocation: '添加至多两个目标地区',
        atLeast: '他们的粉丝中，至少需要有',
        inLocation: '位于 {{location}} 地区',
        platformSub: {
            youtube: '帖子长期有效',
            instagram: '有助于品牌建设',
            tiktok: '适合打造爆款内容',
        },
        influencerSub: {
            microinfluencer: { title: '小型红人', subtitle: '真实互动率高' },
            nicheinfluencer: { title: '垂直领域的红人', subtitle: '专业领域内的影响力' },
            megainfluencer: { title: '顶级红人', subtitle: '海量粉丝' },
        },
    },
    chat: {
        title: 'BoostBot AI 搜索',
        introMessage: `哈喽！{{username}}，咱们今天想要推销什么产品呢？😄`,
        introMessageFirstTimeA: `你好！我是雷宝，您私人专享的AI驱动红人营销助理！😄`,
        introMessageFirstTimeB: `请描述您的产品或品牌，我将发挥魔力为您找到匹配的优秀红人。`,
        introMessageFirstTimeC: `我现在准备好了为您寻找YouTube、TikTok和Instagram平台上，主要粉丝群体位于美国和加拿大的红人。

如果您有其它的目标销售地区，也可以相应调整上方👆的“筛选条件”！
        `,
        noInfluencersFound:
            '哎呀… 我暂时没能找到符合您当前筛选条件的红人。您可尝试调整上方的筛选条件，或在下一次搜索时添加更具体的描述。',
        influencersFound: `将您最心仪的红人添加至邮件进程管理项目中后，请告诉我您是否想要进行下一次搜索。😄`,
        influencersFoundFirstTimeA:
            '从结果中选择您想合作的影响者，并将他们添加到活动中以解锁他们的完整资料和联系信息。',
        influencersFoundFirstTimeB: `雷宝为您提供的专业提示：

广撒网，再筛选！

由于您联系的大多数红人可能不会回复您，所以如果你联系的是更具合作潜质的红人，并只在收到他们的回复后再做筛选的考量，能为您节省大量的时间！
        `,
        influencersFoundAddToSequence:
            '你可以将这些网红达人添加到名为<customLink>Sequence</customLink>「邮件进程管理」的邮件列表中。「邮件进程管理」功能可以让你直接向网红达人发送电子邮件。',
        influencersFoundNextSteps: '你希望做什么呢？',
        sendPlaceholder: '请发送产品描述。',
        stop: '停止BoostBot搜索',
        stopped: 'Boostbot已停止搜索',
        outreachSelected: '将选定的影响者添加到活动中',
        progress: {
            step1: '定位您的产品至合适的细分领域',
            step2: '在数据库中浏览上亿名KOL信息中',
            step2B: '正在我们的数据库中搜索相关的红人',
            step3: '根据您的筛选条件缩小筛选范围',
            step3B: `找到了我认为您会满意的{{ count }} 位红人！`,
        },
        outreachDoneA: `添加成功！

您可点击<customLink>{{sequenceName}}</customLink>查看。`,
        outreachDoneB: `调整您的产品/品牌描述，让我看看还有哪些红人值得推荐！`,
        outreachDoneFirstTime: `添加成功！

您可点击<customLink>{{sequenceName}}</customLink>查看。

邮件进程管理是我们的电子邮件自动化功能。您可以设置属于自己的电子邮件模板，安排您的外联和跟进邮件，与红人的联系沟通将变得轻而易举！
        `,
        and: '和',
        clearChatModal: {
            open: '清除聊天记录和筛选条件',
            title: '确定删除您的BoostBot聊天记录、筛选条件和红人搜索结果吗？',
            confirm: '是',
            cancel: '返回',
        },
    },
    table: {
        account: '账号',
        score: '雷宝搜索的评分',
        followers: '粉丝数',
        audienceGender: '粉丝性别',
        audienceGeolocations: '受众位于',
        noResults: '没有结果',
        pagination: '{{current}} / {{total}}',
        selectAll: '选定全部达人',
        selectInfluencer: '选定达人',
        selectedAmount: '已选择 {{selectedCount}} 个',
        alreadyAddedToSequence: '已添加至邮件进程管理',
    },
    success: {
        influencersToOutreach: '该红人已成功添加至联络列表’',
    },
    error: {
        influencerSearch: '通过Boostbot搜索红人时出错',
        influencersToOutreach: '添加红人至联络列表失败',
        outOfSearchCredits:
            '很抱歉，你已达到解锁红人报告的限额，请<customLink>升级方案</customLink>，以便继续搜索更多内容。',
        expiredAccount:
            '哦，看起来你的帐户已经过期了。你可在升级帐户<customLink>后继续使用雷宝所提供的服务</customLink>。',
    },
    modal: {
        unlockDetailedReport: '解锁分析报告细节',
        topNiches: '红人擅长话题领域分析',
        noNichesFound: '暂时未能找到该红人在此话题领域里的数据',
        audienceEngagementStats: '粉丝互动数据',
        audienceGender: '受众性别分布',
        engagedAudience: '活跃的粉丝占比',
        engagementRate: '互动率',
        averageViews: '平均观看次数',
        channelStats: '频道情况',
        followersGrowth: '粉丝增长率',
        totalPosts: '发布内容数',
        addToSequence: '添加至邮件进程管理',
        addToCampaign: '添加到活动',
        followers: '粉丝数',
    },
};

export default boostbot;
