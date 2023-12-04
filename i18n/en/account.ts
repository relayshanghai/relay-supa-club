const account = {
    account: 'Account',
    update: 'Update',
    personal: {
        title: 'Personal details',
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
        pausedMessage: `Your trial has expired. Please update your account to continue using BoostBot.`,
        canceledMessage: `Your subscription is canceled. Your account will remain active until {{expirationDate}}.`,
        paymentCycle: 'Payment cycle',
        usageLimits: 'Usage limits',
        used: 'Used',
        usedThisMonth: 'Used this month',
        monthlyLimit: 'Monthly limit',
        profilesUnlocked: 'Profiles unlocked',
        searches: 'Searches',
        aiEmailGeneration: 'AI email generation',
        title: 'Subscription',
        viewBillingPortal: 'View billing portal',
        freeTrial: 'Free trial',
        trialExpired: 'Trial expired',
        youHaveNoActiveSubscriptionPleasePurchaseBelow: 'You have no active subscription. Please purchase one below.',
        beforePurchasingYouNeedPaymentMethod: 'Before purchasing a subscription, you need to add a payment method.',
        addPaymentMethod: 'Add payment method',
        availablePlans: 'Available plans',
        planName: 'Name',
        active: 'Active',
        canceled: 'Canceled',
        paused: 'Paused',
        trial: 'Trial',
        upgradeSubscription: 'Upgrade subscription',
        cancelSubscription: 'Cancel subscription',
        monthly: 'monthly',
        quarterly: 'quarterly',
        annually: 'annually',
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
        validDuration: ' For next {{validMonths}} months',
        offEn: 'Off',
        offCn: '',
    },
    plans: {
        discovery: 'Discovery',
        outreach: 'Outreach',
    },
};

export default account;
