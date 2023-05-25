const campaigns = {
    index: {
        title: 'Campaigns',
        status: {
            inProgress: 'In Progress',
            notStarted: 'Not Started',
            completed: 'Completed',
            all: 'All',
            archived: 'Archived Campaigns',
        },
        createCampaign: 'New Campaign',
        noCampaigns: "You don't have any campaigns",
        noCampaignsAvailable: 'Oops! No campaigns available.',
        clickCreate: 'Click here to create a campaign',
        searchPlaceholder: 'Search campaigns...',
        archive: 'Archive',
        unarchive: 'Unarchive',
        edit: 'Edit',
        search: 'Search',
    },
    modal: {
        addToCampaign: 'Add To Campaign',
        addThisInfluencer: 'Add this influencer to your existing campaigns',
        moveToCampaign: 'Move To Campaign',
        moveThisInfluencer: 'Move this influencer to an existing campaign',
        createCampaign: ' or create a new campaign',
        search: 'Search',
        favorites: 'Favorites',
        searchByKeyword: 'Search influencer by name',
        searchDescription: 'You can use an influencers name to search for your influencer.',
        noResults: 'No results yet. Try searching for a influencer by name. ',
        searchCTA: 'Visit our influencer module for more advanced search ability.',
        addFromFavorites: 'Add a influencer from your resource pool',
        favoritesDescription: 'Here you can add influencers directly from your resource pool.',
        outreach: 'Outreach',
        details: 'Details',
        content: 'Content',
        comments: 'Internal Comments',
        viewProfile: 'View Profile',
        addedSuccessfully: 'influencer added successfully.',
        deletedSuccessfully: 'influencer was deleted.',
        deleteConfirmation: 'Are you sure you want to delete this influencer?',
        doNotAdd: 'Do not Add',
        addAnyway: 'Add Anyway',
        influencerAlreadyAdded: 'This influencer already exists in other campaigns:',
        movedSuccessfully: 'Influencer moved successfully!',
    },
    creatorModal: {
        outreach: 'Outreach',
        details: 'Details',
        content: 'Content',
        outbox: 'Outbox',
        comments: 'Internal Comments',
        commentsDescr:
            'The comment section can be used to communicate with your team internally about this influencer. This is only seen by your team, and not by the influencer.',
        outboxDescr: 'The outbox section can be used to track the detail and status of emails sent to the influencer.',
        viewProfile: 'View Profile',
        messagePlaceholder: 'Write here',
        publicationDescr:
            'This is the date the influencer will post your content. Update this regulary to keep your team and yourself aware of the publication date',
        payment: 'Payment',
        paymentDescr:
            'If you negotiated the price with the influencer, write down the price here to keep track of the rate and the payments you have made.',
        paymentStatus: 'Payment Status',
        paidAmount: 'Paid Amount',
        sample: 'Sample',
        sampleDescr:
            'To avoid that samples are sent to the wrong address etc. It is always useful to keep track of the sample status and the address of the influencer.',
        trackingDetails: 'Tracking Details',
        sampleStatus: 'Sample Status',
        save: 'Save',
        noConnectYet: 'You have not reached out yet to this influencer.',
        clickToConnect: 'Click here to send an email!',
        noResponse: 'has not seen or responded to your email yet.',
        followUp: 'Click here to send an follow up email!',
        notInterested: 'Influencer is not interested in this campaign.',
        dayLimit: 'You can only send an influencer an email every 24 hours to avoid spam.',
        emailSent: 'Email sent successfully.',
        sendNewMail: 'Send New Mail',
        to: 'to: ',
        from: 'FROM ',
        sentTag: 'Sent',
        fullypaid: 'Paid',
        unpaid: 'Unpaid',
        partiallypaid: 'Partially Paid',
        sent: 'Sent',
        unsent: 'Unsent',
        delivered: 'Delivered',
        influencerUpdated: 'Influencer Information Updated',
    },
    email: {
        dayLimit: 'You can only send an influencer an email every 24 hours to avoid spam.',
        emailSent: 'Email sent successfully',
        sendEmail: 'Send Mail',
        pickTemplate: 'Pick a template',
        pickTemplateDescr:
            'Pick one of our powerful pre-written templates to connect to your favorite influencer. Increase your chances of getting a reply.',
        initialEmail: 'Initial Email',
        followUpEmail: 'Follow Up Email',
        writeOwnMessage: 'Or write your own message',
        sendEmailError: 'Oops, something went wrong. Please try again.',
        sendAndGoToNext: 'Send and Open Next Influencer',
        sendToAll: 'Send to All influencers with this template',
    },

    show: {
        viewContactInfo: 'View Contact Info',
        status: {
            'in progress': 'In Progress',
            'not started': 'Not Started',
            // eslint-disable-next-line quote-props
            completed: 'Completed',
        },
        archived: 'Campaign archived successfully',
        unarchived: 'Campaign unarchived successfully',
        submitting: 'Submitting',
        editCampaign: 'Edit Campaign',
        promotionPlatforms: 'Promotion Platforms',
        typeOfPromotion: 'Type of Promotion',
        targetGeographic: 'Target Geographic',
        productName: 'Product Name',
        productLink: 'Product Link',
        tags: 'Tags',
        changeStatus: 'Change Status',
        noImages: 'No images uploaded yet',
        budget: 'Budget',
        campaignBudget: 'Campaign Budget',
        numInfluencers: 'Number of Influencers',
        projectDescription: 'Project Description',
        dates: 'Dates',
        closingOutreach: 'Closing Influencer Outreach',
        campaignLaunch: 'Campaign Launch Date',
        campaignEnd: 'Campaign End Date',
        campaignMedia: 'Media Gallery',
        comments: 'Comments',
        contact: 'Contact',
        publicationDate: 'Publication Date',
        account: 'Account',
        creatorStatus: 'Status',
        addedBy: 'Added By',
        nextPoint: 'Next Action Point',
        selectDate: 'Select Date',
        paymentInformation: 'Payment Info',
        paymentAmount: 'Payment Amount',
        paidAmount: 'Paid Amount',
        paymentStatus: 'Payment Status',
        influencerAddress: 'Address',
        sampleStatus: 'Sample Status',
        addActionPoint: 'Add Action Point',
        addAddress: 'Add Address',
        addPaymentInfo: 'Add Payment Details',
        notes: 'Notes',
        important: 'Important',
        importantMessages: 'Important Messages',
        moveInfluencer: 'Move Influencer',
        activities: {
            influencerOutreach: 'Influencer Outreach',
            campaignInfo: 'Campaign Info',
            campaignTracking: 'Campaign Tracking',
            outreach: {
                addNewInfluencer: 'Add New Influencer',
                all: 'All',
                toContact: 'To Contact',
                contacted: 'Contacted',
                inProgress: 'In Progress',
                confirmed: 'Confirmed',
                posted: 'Posted',
                rejected: 'Rejected',
                ignored: 'Ignored',
                noInfluencers: 'No influencers found',
            },
            info: {
                budget: 'Budget',
                campaignBudget: 'Campaign Budget',
                numInfluencers: 'Number of Influencers',
                projectDescription: 'Project Description',
                dates: 'Dates',
                closingOutreach: 'Closing Influencer Outreach',
                campaignLaunch: 'Campaign Launch Date',
                campaignEnd: 'Campaign End Date',
            },
        },
    },
    notes: {
        notes: 'Notes',
        submit: 'Submit',
        emptyComment: 'Comments cannot be empty',
        deleteConfirmation: 'Are you sure you want to delete this comment?',
        deletedSuccessfully: 'Comment deleted successfully',
        updateSuccessfully: 'Comment updated successfully',
    },
    form: {
        createCampaign: 'Create Campaign',
        saveCampaign: 'Save Campaign',
        cancel: 'Cancel',
        selectClientQuestion: 'Select a client',
        selectClientDescription: 'If you are setting up a campaign for a client, please pick a client on the right',
        addNewClient: 'Or add new client',
        nameQuestion: 'Campaign Name',
        nameDescription: 'Enter a fun and unique name for your campaign',
        productNameQuestion: 'Product Name',
        productNameDescription: 'What is the name of the product?',
        descriptionQuestion: 'Project Description',
        descriptionDescription:
            'Try to explain what your campaign is about, and what would you like to achieve with this campaign?',
        productLinkQuestion: 'Product Link',
        productLinkDescription: 'Add a link to your product if any',
        mediaGalleryQuestion: 'Media Gallery',
        mediaGalleryDescription:
            'Add any images that will show your product. The first picture will be used as your campaign’s main picture.',
        noMedia: 'No media files uploaded yet',
        uploadImage: 'Upload Image',
        tagsQuestion: 'Tags',
        tagsDescription: 'Please select a few key words that would describe your campaign and product.',
        tagsPlaceholder: 'Please select relevant tags',
        requirements: 'Requirements',
        requirementsDescription:
            'Additional information for your requirement, to help our algorithm to find you the right Influencers for your campaign',
        targetQuestion: 'Target Geographic',
        targetDescription:
            'Please select your target geographic, so basically who would you like to reach with your campaign.',
        targetPlaceholder: 'Please select target regions',
        budgetQuestion: 'Budget',
        budgetDescription: 'How much budget do you want to allocate to this campaign?',
        numInfluencerQuestion: 'No. Of Influencers',
        numInfluencerDescription: 'Specify the number of Influencers you would like to reach out to',
        timelineQuestion: 'Campaign Timeline',
        timelineDescription: 'Please specify your campaign launch date',
        outreachEnd: 'Influencer Outreach Closing Date',
        campaignLaunch: 'Campaign Launch Date',
        campaignEnd: 'Campaign End Date',
        promotionQuestion: 'Type of Promotion',
        promotionDescription:
            'Please specify the type of promotion you are expecting for this campaign and the Influencers',
        platformQuestion: 'Promotion Platforms',
        platformDescription: 'Please specify which platforms you want to promote on',
        startDate: 'Start date',
        endDate: 'End date',
        fileSizeError: 'File size is too big. Please keep each file within 5Mb.',
        fileSizeErrorAlert: 'The file uploaded is too big, please keep each under 5Mb.',
        successCreateMsg: 'You have created a campaign successfully!',
        successUpdateMsg: 'You have updated a campaign successfully!',
        dedicatedVideo: 'Dedicated Video',
        integratedVideo: 'Integrated Video',
        oopsSomethingWrong: 'Oops, something went wrong. Please try again.',
    },
    post: {
        title: 'Manage Posts',
        addPostUrl: 'Add Post URL',
        addAnotherPost: 'Add Another Post',
        submit: 'Submit',
        invalidUrl: 'Invalid URL',
        duplicateUrl: 'Duplicate URL',
        success: 'Successfully added {{amount}} URLs',
        failed: 'Failed to get post data for {{amount}} URLs',
        currentPosts: 'Current Posts',
    },
    manageInfluencer: {
        title: 'Manage Influencer',
        influencerFee: 'Influencer Fee',
        sales: 'Sales',
    },
};
export default campaigns;
