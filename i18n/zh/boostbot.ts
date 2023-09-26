const boostbot = {
    filters: {
        modalTitle: '基础筛选条件',
        fromPlatform: '我想要看以下平台的红人',
        fromGeos: '他们的粉丝所在地区位于',
        addMoreGeos: '添加更多',
        selectGeo: '选择一个国家地区',
        advancedFilters: '高级筛选条件',
        updateFilters: '更新筛选条件',
        atLeast: '他们的粉丝中，至少需要有',
        inLocation: '位于 {{location}} 地区',
    },
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
        unlockDone: `太棒了, 你刚刚解锁了新的红人 {{count}}, 在试用期间, 你最多可以解锁50位红人报告, 或者你也可以<customLink>升级方案解锁更多</customLink>。

小贴士：您也可以选择逐个解锁 KOL。`,
        outreachDone: `太棒了！ 我正在安排发送邮件。

一个小提示：你可以在"<customLink>拓展方案中</customLink>"查看邮件状态。`,
        hasUsedUnlock: '真棒！你刚刚解锁了新的红人 {{count}}。',
        hasUsedOutreach: `好的，我正在安排发送邮件。

一个小提示：你也可以选择不给其中一部分红人发送邮件，只需将他们从列表中删除即可。`,
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
        outOfSearchCredits:
            '很抱歉，你已达到解锁红人报告的限额，请<customLink>升级方案</customLink>，以便继续搜索更多内容。',
        outOfProfileCredits: '很抱歉，你已达到解锁红人报告的限额，请 <customLink>升级方案</customLink> 解锁更多。',
    },
};

export default boostbot;
