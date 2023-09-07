const boostbot = {
    chat: {
        introMessage: `嗨, 我是BoostBot 🙂

请向我发送您的产品英文描述，我将为您推荐适合该产品在海外社媒推广的红人。

产品描述案例："IPL uses beams of light to target the pigment in the hair follicles, which then heats up to remove the hair"。`,
        influencersFound: '我精选了 {{count}} 位KOL, 他们有很大的潜力来推广您的产品并促成销售。下一步您想要做什么?',
        sendPlaceholder: '请发送产品描述。',
        stop: '停止BoostBot搜索',
        stopped: 'Boostbot已停止搜索',
        noInfluencersToUnlock: '您已经解锁了当前页面上的所有KOL。',
        unlockPage: '解锁当前页面的KOL',
        unlockPageShort: '解锁KOL',
        outreachPage: '给当前页面的KOL发邮件',
        outreachPageShort: '给KOL发送电子邮件',
        progress: {
            step1: '生成话题和细分领域中',
            step2: '在数据库中浏览上亿名KOL信息中',
            step2B: '找到了上千名KOL',
            step3: '正在根据粉丝数、互动率、地域等维度精选最佳KOL',
            step3B: '已选定 {{count}} 名KOL',
        },
        unlockDone: `恭喜您已解锁了 {{count}} 位新的 KOL。在免费试用期间,您可以解锁最多 50 位 KOL, 并给他们发送邮件, 您也可以付费升级获取更多额度。

小贴士：您也可以选择逐个解锁 KOL。`,
        outreachDone: `没问题，我正在安排邮件发送。在免费试用期内，您可解锁并发送邮件给最多 50 位 KOL ，您还可以付费升级获取更多额度。

小贴士：您可以在“邮件进程管理”中查看电子邮件的状态。`,
        hasUsedUnlock: '太棒啦！您刚刚解锁了 {{count}} 位新的 KOL。您还可以给他们发送邮件, 且不会花费额外的额度。',
        hasUsedOutreach: `没问题，我正在安排邮件发送。在您的免费试用期内，您可以解锁以及发送电子邮件给最多 50 位 KOL ，您也可以付费升级获取更多额度。

小贴士: 您可以选择不给某一个KOL发送邮件, 将其从列表中移除即可。`,
    },
    table: {
        account: '账号',
        topPosts: '热门发布帖子',
        email: '邮箱地址',
        unlockInfluencer: '解锁红人报告',
        removeInfluencer: '移除该红人',
        noResults: '没有结果',
        pagination: '{{current}} / {{total}}',
    },
    success: {
        influencersToOutreach: '该红人已成功添加至联络列表’',
    },
    error: {
        influencerSearch: '通过Boostbot搜索红人时出错',
        influencerUnlock: '解锁红人报告失败',
        influencersToOutreach: '添加红人至联络列表失败',
        outOfSearchCredits: '哎呀，看起来您已经用光了所有的搜索额度。请付费升级订阅，以便继续进行更多的搜索。',
        outOfProfileCredits: '哎呀, 看起来您的额度已经不够解锁所有的KOL了。请升级订阅以解锁更多内容。',
    },
};

export default boostbot;
