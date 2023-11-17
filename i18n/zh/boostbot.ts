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
            youtube: 'Devoted audiences',
            instagram: 'Great for brand building',
            tiktok: 'High content virality',
        },
        influencerSub: {
            microinfluencer: { title: '小型红人', subtitle: 'Devoted audiences' },
            nicheinfluencer: { title: '垂直领域的红人', subtitle: 'Great for brand building' },
            megainfluencer: { title: '顶级红人', subtitle: 'High content virality' },
        },
    },
    chat: {
        introMessage: `哈喽！{{username}}，咱们今天想要推销什么产品呢？😄`,
        introMessageFirstTimeA: `你好！我是雷宝，您私人专享的AI驱动红人营销助理！😄`,
        introMessageFirstTimeB: `请描述您的产品或品牌，我将发挥魔力为您找到匹配的优秀红人。`,
        introMessageFirstTimeC: `我现在准备好了为您寻找YouTube、TikTok和Instagram平台上，主要粉丝群体位于美国和加拿大的红人。`,
        noInfluencersFound:
            '哎呀… 我暂时没能找到符合您当前筛选条件的红人。您可尝试调整上方的筛选条件，或在下一次搜索时添加更具体的描述。',
        influencersFound: `将您最心仪的红人添加至邮件进程管理项目中后，请告诉我您是否想要进行下一次搜索。😄`,
        influencersFoundFirstTimeA:
            '您可从搜索结果中选择有合作意向的红人，将他们添加到邮件进程管理项目中解锁查看红人完整个人资料和联系方式。',
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
        outreachSelected: '将已选中的网红达人添加至邮件进程管理项目',
        progress: {
            step1: '生成话题和细分领域中',
            step2: '在数据库中浏览上亿名KOL信息中',
            step2B: '找到了上千名KOL',
            step3: '正在根据粉丝数、互动率、地域等维度精选最佳KOL',
            step3B: '已选定 {{count}} 名KOL',
        },
        outreachDone:
            '好的！我现在将选中的网红达人添加至你的邮件进程管理项目中。你可以在此处查看状态：<customLink>{{sequenceName}}</customLink>',
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
        audienceEngagementStats: '粉丝互动数据',
        audienceGender: '受众性别分布',
        engagedAudience: '活跃的粉丝占比',
        engagementRate: '互动率',
        averageViews: '平均观看次数',
        channelStats: '频道情况',
        followersGrowth: '粉丝增长率',
        totalPosts: '发布内容数',
        addToSequence: '添加至邮件进程管理',
        followers: '粉丝数',
    },
};

export default boostbot;
