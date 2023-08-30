import type { AccountAccountMessagesGet } from 'types/email-engine/account-account-messages-get';

export const dummyData: AccountAccountMessagesGet = {
    total: 2,
    page: 1,
    pages: 1,
    messages: [
        {
            id: '1',
            uid: 123,
            emailId: 'email_1',
            threadId: 'thread_1',
            date: '2023-08-30T10:00:00Z',
            flags: ['flag_1', 'flag_2'],
            labels: ['label_1', 'label_2'],
            unseen: true,
            size: 1024,
            subject: 'Sample Subject 1',
            from: {
                name: 'John Doe',
                address: 'john@example.com',
            },
            replyTo: [
                {
                    name: 'Jane Smith',
                    address: 'jane@example.com',
                },
            ],
            to: [
                {
                    name: 'Alice Johnson',
                    address: 'alice@example.com',
                },
                {
                    name: 'Bob Brown',
                    address: 'bob@example.com',
                },
            ],
            messageId: 'Scheduled',
            text: {
                id: 'text_1',
                encodedSize: {
                    plain: 500,
                    html: 700,
                },
            },
        },
        {
            id: '2',
            uid: 456,
            emailId: 'email_2',
            threadId: 'thread_2',
            date: '2023-08-29T15:30:00Z',
            flags: ['flag_3'],
            labels: ['label_2', 'label_3'],
            unseen: false,
            size: 512,
            subject: 'Another Sample Subject',
            from: {
                name: 'Alice Johnson',
                address: 'alice@example.com',
            },
            replyTo: [],
            to: [
                {
                    name: 'John Doe',
                    address: 'john@example.com',
                },
            ],
            messageId: 'TESTEMAILID',
            text: {
                id: 'text_2',
                encodedSize: {
                    plain: 300,
                    html: 400,
                },
            },
        },
        // Add more dummy data messages as needed
    ],
};

export const dummyMessages = {
    total: 3,
    page: 1,
    pages: 1,
    messages: [
        {
            id: '1',
            uid: 101,
            emailId: 'email_101',
            threadId: 'thread_1',
            date: '2023-08-25T10:30:00Z',
            draft: false,
            unseen: true,
            flagged: false,
            size: 2356,
            subject: 'Hello World',
            from: {
                name: 'John Doe',
                address: 'john.doe@example.com',
            },
            replyTo: [
                {
                    address: 'replyto@example.com',
                },
            ],
            to: [
                {
                    address: 'recipient1@example.com',
                },
                {
                    address: 'recipient2@example.com',
                },
            ],
            cc: [
                {
                    name: 'CC Recipient',
                    address: 'cc@example.com',
                },
            ],
            bcc: [],
            messageId: 'message_1',
            inReplyTo: 'parent_message_1',
            flags: ['flag1', 'flag2'],
            labels: ['label1', 'label2'],
            attachments: [
                {
                    id: 'attachment_1',
                    contentType: 'application/pdf',
                    encodedSize: 10240,
                    embedded: false,
                    inline: false,
                    contentId: '',
                },
            ],
            text: {
                id: 'text_1',
                encodedSize: {
                    plain: 1200,
                    html: 1800,
                },
            },
            preview: 'This is a preview of the email.',
            path: '/inbox/1',
        },
        {
            id: '2',
            uid: 102,
            emailId: 'email_102',
            threadId: 'thread_2',
            date: '2023-08-26T15:45:00Z',
            draft: true,
            unseen: false,
            flagged: true,
            size: 1897,
            subject: 'Meeting Agenda',
            from: {
                name: 'Jane Smith',
                address: 'jane.smith@example.com',
            },
            replyTo: [
                {
                    address: 'replyto@example.com',
                },
            ],
            to: [
                {
                    address: 'team@example.com',
                },
            ],
            cc: [],
            bcc: [],
            messageId: 'message_2',
            inReplyTo: '',
            flags: ['flag3'],
            labels: ['label3'],
            attachments: [],
            text: {
                id: 'text_2',
                encodedSize: {
                    plain: 800,
                    html: 1200,
                },
            },
            preview: 'Meeting agenda attached.',
            path: '/drafts/2',
        },
        {
            id: '3',
            uid: 103,
            emailId: 'email_103',
            threadId: 'thread_3',
            date: '2023-08-27T09:00:00Z',
            draft: false,
            unseen: false,
            flagged: false,
            size: 2800,
            subject: 'Weekend Getaway',
            from: {
                name: 'Vacation Travel',
                address: 'travel@example.com',
            },
            replyTo: [],
            to: [
                {
                    address: 'you@example.com',
                },
            ],
            cc: [],
            bcc: [],
            messageId: 'message_3',
            inReplyTo: '',
            flags: [],
            labels: ['label4'],
            attachments: [
                {
                    id: 'attachment_2',
                    contentType: 'image/jpeg',
                    encodedSize: 5120,
                    embedded: false,
                    inline: true,
                    contentId: 'image123',
                },
            ],
            text: {
                id: 'text_3',
                encodedSize: {
                    plain: 1600,
                    html: 2400,
                },
            },
            preview: 'Exciting weekend getaway!',
            path: '/inbox/3',
        },
    ],
};

export const dummyThread = [
    {
        threadId: 'thread_1',
        html: '<p>This is the HTML content for thread 1.</p>',
        plain: 'This is the plain text content for thread 1.',
    },
    {
        threadId: 'thread_2',
        html: '<p>This is the HTML content for thread 2.</p>',
        plain: 'This is the plain text content for thread 2.',
    },
    {
        threadId: 'thread_3',
        html: '<p>This is the HTML content for thread 3.</p>',
        plain: 'This is the plain text content for thread 3.',
    },
];
