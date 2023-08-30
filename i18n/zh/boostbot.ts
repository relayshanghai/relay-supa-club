const boostbot = {
    chat: {
        introMessage: `嗨, 我是BoostBot 🙂

请向我发送您的产品英文描述，我将为您推荐适合该产品在海外社媒推广的红人。

产品描述案例："IPL uses beams of light to target the pigment in the hair follicles, which then heats up to remove the hair"。`,
        influencersFoundA: '我精选了',
        influencersFoundB: '位KOL, 他们有很大的潜力来推广您的产品并促成销售。下一步您想要做什么?',
        sendPlaceholder: '请发送产品描述。',
        stop: '停止BoostBot搜索',
        stopped: 'Boostbot stopped',
        unlockPage: '解锁当前页面的KOL',
        outreachPage: '给当前页面的KOL发邮件',
        progress: {
            step1: '生成话题和细分领域中',
            step2: '在数据库中浏览上亿名KOL信息中',
            step2B: '找到了上千名KOL',
            step3: '正在根据粉丝数、互动率、地域等维度精选最佳KOL',
            step3B: '已选定 __ 名KOL',
        },
    },
    table: {
        account: '账号',
        topPosts: '热门发布帖子',
        email: '邮箱地址',
        unlockInfluencer: 'Unlock influencer',
        removeInfluencer: 'Remove influencer',
        noResults: 'No results',
    },
    success: {
        influencersToOutreach: 'Influencers successfully added to outreach!',
    },
    error: {
        influencerSearch: 'Error fetching Boostbot influencers',
        influencerUnlock: 'Unlocking influencer failed',
        influencersToOutreach: 'Adding influencer to outreach failed',
    },
};

export default boostbot;
