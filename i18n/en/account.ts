const account = {
    account: 'Account',
    update: 'Update personal fnfo',
    personal: {
        title: 'Personal Info',
        firstName: 'First name',
        firstNamePLaceholder: 'Enter your first name',
        lastName: 'Last name',
        lastNamePLaceholder: 'Enter your last name',
        email: 'Email',
        emailPlaceholder: 'hello@boostbot.ai',
        profileUpdated: 'Profile updated',
        oopsWentWrong: 'Oops, something went wrong',
        updateEmail: 'Update email',
        confirmationEmailSentToNewAddress: 'Confirmation email sent to new address',
        pleaseEnterNewEmail: 'Please enter a new email',
        pleaseEnterValidEmail: 'Please enter a valid email',
    },
    company: {
        companyName: 'Company name',
        website: 'Website',
        websiteAddress: 'Website address',
        title: 'Company account details',
        members: 'Team Members',
        joinRequest: 'Join Requests',
        acceptRequest: 'Accept',
        ignoreRequest: 'Ignore',
        fullName: 'Full Name',
        role: 'Role',
        pendingInvitations: 'Pending Invitations',
        email: 'Email',
        addMoreMembers: 'Add more members',
        admin: 'Admin',
        member: 'Member',
        companyProfileUpdated: 'Company profile updated',
        oopsWentWrong: 'Oops, something went wrong',
    },
    subscription: {
        plan: 'Current Plan',
        renewsOn: 'Renews on',
        expirationDate: 'Expiration Date',
        subscriptionStatus: 'Subscription Status',
        pausedMessage: `Your access period has ended. Please upgrade your account or subscribe to continue using BoostBot.`,
        canceledMessage: `Your subscription is canceled. Your account will remain active until {{expirationDate}}.`,
        paymentCycle: 'Payment cycle',
        usageLimits: 'Usage limits',
        used: 'Used',
        usedThisMonth: 'Used this month',
        monthlyLimit: 'Monthly limit',
        profilesUnlocked: 'Profiles unlocked',
        searches: 'Searches',
        title: 'Subscription',
        viewBillingPortal: 'View billing portal',
        freeTrial: 'Free trial',
        trialExpired: 'Trial expired',
        youHaveNoActiveSubscriptionPleasePurchaseBelow: 'You have no active subscription. Please purchase one below.',
        beforePurchasingYouNeedPaymentMethod: 'Before purchasing a subscription, you need to add a payment method.',
        addPaymentMethod: {
            title: 'Add payment method',
            success: 'Payment method added',
            error: 'Unable to add payment method',
        },
        availablePlans: 'Available plans',
        planName: 'Name',
        active: 'Active',
        canceled: 'Canceled',
        paused: 'Paused',
        trial: 'Trial',
        upgradeSubscription: 'Upgrade or modify your plan',
        cancelSubscription: 'Cancel subscription',
        resumeSubscription: 'Don’t cancel my subscription!',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        annually: 'Annually',
        modal: {
            plan_planName: '{{planName}} plan',
            youAreAboutToSubscribeFor: 'You are about to subscribe for',
            subscribing: 'Subscribing...',
            subscriptionPurchased: 'Subscription purchased',
            wentWrong: 'Oops, something went wrong',
            subscribe: 'Subscribe',
            noteClickingSubscribeWillCharge: 'Note that clicking `Subscribe` will charge the default payment method.',
            close: 'Close',
            backToAccount: 'Back to account',
            perMonth: '/month',
            billed_period: 'Billed {{period}}',
            actionLimitedToAdmins: 'This action is limited to company admins',
            noActiveSubscriptionToUpgrade: 'No active subscription to upgrade',
            unableToActivateSubscription: 'Unable to activate subscription',
            missingCompanyData: 'Missing company data',
            missingPriceId: 'Missing price ID',
            noPaymentMethod: 'No payment method',
            alreadySubscribed: 'Already subscribed',
        },
        upgrade: 'Upgrade',
        upgradeSuccess: 'Upgrade success',
        upgradeSubscriptionError: 'Unable to upgrade subscription',
        resumeSubscriptionSuccess: 'Subscription successfully resumed!',
        resumeSubscriptionError: 'Unable to resume subscription',
    },
    invite: {
        title: 'Invite Members',
        inviteMoreMembers: 'Invite more members to your company',
        typeEmailAddressHere: 'Type email address here',
        emailAddress: 'Email address',
        sendInvitation: 'Send invitation',
        cancel: 'Cancel',
        makeAdmin: 'Make admin',
    },
    cancel: 'Cancel',
    cancelModal: {
        title: 'Cancel subscription',
        areYouSureYouWantToCancelYourSubscription: 'Are you sure you want to cancel your subscription?',
        youWillLoseAccessToAllFeature: `You will no longer have access to Boostbot features after {{expirationDate}}.`,
        currentPeriodEnd: 'current period end',
        cancelSubscription: 'Cancel subscription',
        orRenewAtDiscount_percentage: 'Or renew now at {{percentage}}% discount',
        renewNow: 'Renew now',
        cancelling: 'Cancelling...',
        subscriptionCancelled: 'Subscription cancelled',
    },
    planIsReady: 'Your plan is ready!',
    redirectingMsg: 'Redirecting...',
    card: 'Card',
    alipay: 'Alipay',
    choosePaymentMethod: 'Please choose a payment method.',
    contactUs: 'Please Contact our support team if you prefer to pay with Alipay.',
    payments: {
        promoCode: 'Promo Code',
        apply: 'Apply',
        enterPromoCode: 'Enter a Promo Code',
        invalidPromoCode: 'Invalid Promo Code',
        promoCodeAdded: 'Promo Code added',
        validDuration: ' for next {{validMonths}} month(s)',
        offEn: 'Off',
        offCn: '',
    },
    plans: {
        discoveryTrial: 'Discovery Trial',
        discovery: 'Discovery',
        outreach: 'Outreach',
    },
    planDescriptions: {
        discoveryTrial: 'AI powered search and analysis',
        discovery: 'AI powered search and analysis',
        outreach: 'Fully automated discovery and email campaigns',
    },
    enableAlipay: 'Enable Alipay Agreement',
    processingMessage: `We are currently processing your payment.

Thank you for your patience.`,
    generalPaymentError: 'Something went wrong in the process, please try again or use another payment method.',
    authorizationPaymentError:
        'Your Alipay payment authorization failed, please try again or use another payment method.',
    paymentCompanySubscription: 'Profile, Company and Subscriptions',
    sidebar: {
        plan: 'Plan',
        billing: 'Billing',
        profile: 'Profile',
        company: 'Company',
        team: 'Team',
    },
    paymentMethodCard: {
        title: 'Payment Methods',
        addPaymentMethod: 'Add new payment method',
    },
    paymentMethodModal: {
        title: 'Add Payment Method',
    },
    planSection: {
        reportsCount: 'Reports',
        searchesCount: 'Searches',
        exportsCount: 'Exports',
        trialEnds: 'Trial Ends',
        canceledOn: 'Canceled on',
        cancelsOn: 'Cancels on',
        paymentFailed: 'Payment Failed',
        paymentFailedAction: 'You need to subscribe again to continue using BoostBot.',
        paymentDue: 'Payment Due',
        pausedAt: 'Paused at',
        noUpcomingPayments: 'No upcoming payments',
        renewsOn: 'Renews on',
        errorGettingSubscription: 'Error getting subscription info',
        subscriptionExpired: 'Subscription Expired',
        subscriptionExpiredAction:
            'Uh oh! Your account subscription has expired. Please purchase a subscription to continue using BoostBot!',
    },
    billingInfoSection: {
        title: 'Billing Info',
    },
    companyInfoSection: {
        title: 'Company Info',
    },
};

export default account;
