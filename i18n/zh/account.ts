const account = {
    account: '账号',
    update: '更新',
    personal: {
        title: '个人信息',
        firstName: '名字',
        firstNamePLaceholder: '输入您的名字',
        lastName: '姓氏',
        lastNamePLaceholder: '输入您的姓氏',
        email: '电子邮件',
        emailPlaceholder: '输入您的邮箱地址',
        profileUpdated: '个人信息已更新',
        oopsWentWrong: '哎呀，出错了',
        updateEmail: '更新电子邮件',
        confirmationEmailSentToNewAddress: '已发送确认邮件到新地址',
        pleaseEnterNewEmail: '请输入新的电子邮件',
        pleaseEnterValidEmail: '请输入有效的电子邮件',
    },
    company: {
        companyName: '公司名称',
        website: '网站',
        websiteAddress: '网站地址',
        title: '公司信息',
        members: '团队成员',
        fullName: '全名',
        role: '角色',
        pendingInvitations: '待处理的邀请',
        email: '电子邮件',
        addMoreMembers: '邀请成员加入',
        admin: '管理员',
        member: '成员',
        companyProfileUpdated: '公司信息已更新',
        oopsWentWrong: '哎呀，出错了',
    },
    subscription: {
        plan: '当前方案',
        renewsOn: '续订日期',
        expirationDate: '到期日期',
        subscriptionStatus: '订阅状态',
        pausedMessage: `您的试用账号已到期，请更新账户方案来继续使用 BoostBot雷宝 各项功能使用权限。`,
        canceledMessage: `您的订阅已取消，该账号将在{{expirationDate}}后失去 BoostBot 各项功能使用权限。`,
        paymentCycle: '付款周期',
        usageLimits: '使用限制',
        used: '已使用',
        usedThisMonth: '本月已使用',
        monthlyLimit: '每月限制',
        profilesUnlocked: '解锁的KOL资料',
        searches: 'KOL搜索',
        aiEmailGeneration: 'AI 邮件生成',
        title: '订阅方案',
        viewBillingPortal: '查看账单',
        freeTrial: '免费试用',
        trialExpired: '试用已过期',
        youHaveNoActiveSubscriptionPleasePurchaseBelow: '您没有活动的订阅。请在下面购买。',
        beforePurchasingYouNeedPaymentMethod: '在购买订阅之前，您需要添加付款方式。',
        addPaymentMethod: '添加付款方式',
        availablePlans: '可用方案',
        planName: '名称',
        active: '活跃',
        canceled: '已取消',
        paused: '已暂停',
        trial: '试用',
        upgradeSubscription: '升级订阅',
        cancelSubscription: '取消订阅',
        monthly: '每月',
        quarterly: '每季度',
        annually: '每年',
        modal: {
            plan_planName: '{{planName}} 方案',
            youAreAboutToSubscribeFor: '您将订阅',
            subscribing: '订阅中...',
            subscriptionPurchased: '订阅已购买',
            wentWrong: '哎呀，出错了',
            subscribe: '订阅',
            noteClickingSubscribeWillCharge: '注意：点击“订阅”将立即收取费用。',
            close: '关闭',
            backToAccount: '返回账号',
            perMonth: '每月',
            billed_period: '收费周期：{{period}}',
            actionLimitedToAdmins: '此操作仅限管理员执行',
            noActiveSubscriptionToUpgrade: '没有可升级的订阅',
            unableToActivateSubscription: '无法激活订阅',
            missingCompanyData: '缺少公司数据',
            missingPriceId: '缺少价格ID',
            noPaymentMethod: '没有付款方式',
            alreadySubscribed: '已订阅',
        },
        upgrade: '升级订阅',
        upgradeSuccess: '升级成功',
        upgradeSubscriptionError: '升级订阅失败',
    },
    invite: {
        title: '邀请成员加入',
        inviteMoreMembers: '邀请更多成员',
        typeEmailAddressHere: '在此输入电子邮件地址',
        emailAddress: '电子邮件地址',
        sendInvitation: '发送邀请',
        cancel: '取消',
        makeAdmin: '设为管理员',
    },
    cancel: '取消',
    cancelModal: {
        title: '取消订阅',
        areYouSureYouWantToCancelYourSubscription: '您确定要取消订阅吗？',
        youWillLoseAccessToAllFeature: `您将在 {{expirationDate}} 后失去 BoostBot 各项功能使用权限。`,
        currentPeriodEnd: '本期订阅结束',
        cancelSubscription: '取消订阅',
        orRenewAtDiscount_percentage: '或以 {{percentage}} 折扣续订',
        renewNow: '立即续订',
        cancelling: '取消中...',
        subscriptionCancelled: '订阅已取消',
    },
    planIsReady: '您已成功订阅！',
    redirectingMsg: '正在自动跳转页面...',
    card: '银行卡',
    alipay: '支付宝',
    choosePaymentMethod: '请选择付款方式',
    contactUs: '如果需要支付宝支付，请联系我们客服。',
    payments: {
        promoCode: '折扣码',
        apply: '应用',
        enterPromoCode: '输入折扣码',
        invalidPromoCode: '无效的折扣码',
        promoCodeAdded: '折扣码已添加',
        validDuration: ' 前{{validMonths}}个月有效',
        offEn: '',
        offCn: '节省',
    },
    plans: {
        discovery: '探索方案',
        outreach: '拓展方案',
    },
};

export default account;
