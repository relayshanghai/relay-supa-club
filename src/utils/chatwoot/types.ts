export type ChatwootAccount = {
    id: number;
    name: string;
};

export type ChatwootInbox = {
    id: number;
    name: string;
};

export type ChatwootContact = {
    id: number;
    name: string;
    avatar: string;
    type: 'contact';
    account: ChatwootAccount;
};

export type ChatwootUser = {
    id: number;
    name: string;
    email: string;
    type: 'user';
};

export type ChatwootMessage = {
    id: number;
    content: string;
    message_type: number;
    created_at: string;
    private: boolean;
    source_id: string | null;
    content_type: string;
    content_attributes: object;
    sender: ChatwootUser | ChatwootContact;
    account: ChatwootAccount;
    conversation: ChatwootConversation;
    inbox: ChatwootInbox;
};

export type ChatwootConversation = {
    additional_attributes: {
        browser: {
            device_name: string;
            browser_name: string;
            platform_name: string;
            browser_version: string;
            platform_version: string;
        };
        referer: string;
        initiated_at: {
            timestamp: string;
        };
    };
    can_reply: boolean;
    channel: string;
    id: number;
    inbox_id: number;
    contact_inbox: {
        id: number;
        contact_id: number;
        inbox_id: number;
        source_id: string;
        created_at: string;
        updated_at: string;
        hmac_verified: boolean;
    };
    messages: ChatwootMessage[];
    meta: {
        sender: ChatwootContact;
        assignee: ChatwootUser;
    };
    status: string;
    unread_count: number;
    agent_last_seen_at: string;
    contact_last_seen_at: string;
    timestamp: string;
    account_id: number;
};

export type ChatwootWebhookEventName =
    | 'webwidget_triggered'
    | 'conversation_created'
    | 'conversation_status_changed'
    | 'conversation_updated'
    | 'message_created'
    | 'message_updated';

export type ChatwootWebwidgetTriggered = {
    id: number;
    contact: ChatwootContact;
    inbox: ChatwootInbox;
    account: ChatwootAccount;
    current_conversation: ChatwootConversation;
    source_id: string;
    event: ChatwootWebhookEventName;
    event_info: {
        initiated_at: {
            timestamp: 'string';
        };
        referer: string;
        widget_language: string;
        browser_language: string;
        browser: {
            browser_name: string;
            browser_version: string;
            device_name: string;
            platform_name: string;
            platform_version: string;
        };
    };
};

export type ChatwootConversationCreated = {
    event: ChatwootWebhookEventName;
} & ChatwootConversation;

export type ChatwootConversationStatusChanged = {
    event: ChatwootWebhookEventName;
} & ChatwootConversation;

export type ChatwootConversationUpdated = {
    event: ChatwootWebhookEventName;
    changed_attributes: [
        {
            [attribute_name: string]: {
                current_value: any;
                previous_value: any;
            };
        },
    ];
} & ChatwootConversation;

export type ChatwootMessageCreated = {
    event: ChatwootWebhookEventName;
} & ChatwootMessage;

export type ChatwootMessageUpdated = {
    event: ChatwootWebhookEventName;
} & ChatwootMessage;

export type ChatwootWebhookEvent =
    | ChatwootWebwidgetTriggered
    | ChatwootConversationCreated
    | ChatwootConversationStatusChanged
    | ChatwootConversationUpdated
    | ChatwootMessageCreated
    | ChatwootMessageUpdated;

export type ChatwootSDKParams = { websiteToken: string; baseUrl?: string };

export type ChatwootSettings = {
    hideMessageBubble?: boolean;
    position?: 'left' | 'right';
    locale?: string;
    useBrowserLanguage?: boolean;
    type?: 'standard' | 'expanded_bubble';
    darkMode?: 'light' | 'auto';
    launcherTitle?: string;
    showPopoutButton?: boolean;
};

export type ChatwootConfig = ChatwootSettings & ChatwootSDKParams;

export type Chatwoot = {
    baseUrl: string;
    hasLoaded: boolean;
    hideMessageBubble: boolean;
    isOpen: boolean;
    position: string;
    websiteToken: string;
    locale: string;
    useBrowserLanguage: boolean;
    type: string;
    launcherTitle: string;
    showPopoutButton: boolean;
    widgetStyle: string;
    resetTriggered: boolean;
    darkMode: string;
    toggle: (state?: 'open' | 'close') => void;
    toggleBubbleVisibility: (state?: 'show' | 'hide') => void;
    popoutChatWindow: () => void;
    setUser: (
        id: string,
        additional_params: {
            identifier_hash?: string;
            [key: string]: any;
        },
    ) => void;
    setCustomAttributes: (attributes: { [key: string]: any }) => void;
    deleteCustomAttribute: (attributeKey: string) => void;
    setConversationCustomAttributes: (attributes: { [key: string]: any }) => void;
    deleteConversationCustomAttribute: (attributeKey: string) => void;
    setLabel: (label: string) => void;
    removeLabel: (label: string) => void;
    setLocale: (locale: string) => void;
    setColorScheme: (scheme: string) => void;
    reset: () => void;
};

export type WindowChatwoot = {
    chatwootSettings: ChatwootSettings;
    chatwootSDK: {
        run: (params: ChatwootSDKParams) => void;
    };
    $chatwoot?: Chatwoot;
};
