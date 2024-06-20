const inbox = {
    title: 'Inbox',
    noMessagesInMailbox: 'No messages from this Mailbox yet',
    unread: 'Unread',
    inbox: 'All',
    searchMessages: 'Search Messages:',
    searchPlaceholder: 'Search inbox',
    threadHeader: {
        sequence: 'Sequence',
        product: 'Product',
        firstReply: 'First Reply',
        participants: 'Participants',
    },
    filters: {
        title: 'Filter threads',
        byMessageStatus: {
            All: 'All',
            Unread: 'Unread',
            Unreplied: 'Unreplied',
        },
        byCollabStatus: 'Filter by collab status',
        bySequence: 'Filter by sequence',
    },
    send: 'Send',
    replyPlaceholder: 'Type your message to reply',
    from: 'From',
    to: 'To',
    cc: 'cc',
    sequence: 'Sequence',
    lastMessage: 'Last Message',
    product: 'Product',
    threadPreview: {
        emptyState: {
            title: 'No messages yet',
            description: 'Check again later',
        },
    },
    newInboxMessage: {
        title: 'New Inbox UI',
        message: `In light of your feedback regarding usability, we've upgraded the inbox interface.
        You'll have the opportunity to evaluate our enhancements before we introduce them to all
        other users.`,
        oldInbox: 'Old Inbox UI',
        dismissMessage: 'Dismiss',
    },
    replyToThread: 'Reply to thread',
    replyAllTo: 'Reply to',
    attachments: {
        loading: 'Starting download...',
        success: 'Download started',
        error: 'Error when downloading attachment',
        toBigTitle: 'This attachment is too big!',
        toBigDescription: 'Please ask the sender for a link instead. BoostBot handles up to 20MB attachments.',
        failedToDownload:
            'Uh oh! Issue with email attachments. Please report this bug to our tech team using the “Report a Bug” button on the right. We’re on it! Uh oh! Issue with email attachments. Please report this bug to our tech team using the “Report a Bug” button on the right. We’re on it!',
    },
    save: 'Save',
    edit: 'Edit',
    saveChanges: 'Save changes',
    remove: 'Remove',
};

export default inbox;
