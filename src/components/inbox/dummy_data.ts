import type { AccountAccountMessagesGet, MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { inManagerDummyInfluencers } from '../sequences/in-manager-dummy-sequence-influencers';
import templates from 'src/mocks/api/email-engine/templates.json';

const company = 'DJI';

const messages: MessagesGetMessage[] = inManagerDummyInfluencers.map((influencer, index) => {
    return {
        id: influencer.id,
        uid: 123, // Replace with an appropriate value
        emailId: `email_${influencer.id}`, // You can use any relevant value here
        threadId: `thread_${influencer.email}`, // You can use any relevant value here
        date: influencer.created_at,
        flags: influencer.tags, // Use influencer's tags as flags
        labels: ['label_1', 'label_2'], // Replace with relevant labels
        unseen: false, // You can set this based on your logic
        size: 1024, // Replace with an appropriate value
        subject: templates[index % 4].content.subject.replace(/{{\s*[^{}]+\s*}}/g, company), // You can use any relevant value here
        from: {
            name: influencer.name || 'John Doe',
            address: influencer.email || 'example@example.com',
        },
        replyTo: [
            {
                name: 'Jane Smith', // Replace with appropriate name
                address: 'jane@example.com', // Replace with appropriate address
            },
        ],
        to: [
            {
                name: 'Alice Johnson', // Replace with appropriate name
                address: 'alice@example.com', // Replace with appropriate address
            },
            {
                name: 'Bob Brown', // Replace with appropriate name
                address: 'bob@example.com', // Replace with appropriate address
            },
        ],
        messageId: influencer.id + influencer.funnel_status, // Use influencer's funnel status as messageId
        text: {
            id: `text_${influencer.sequence_step}`, // You can use any relevant value here
            encodedSize: {
                plain: 500, // Replace with an appropriate value
                html: 700, // Replace with an appropriate value
            },
        },
    };
});

export const dummyData: AccountAccountMessagesGet = {
    total: 10,
    page: 1,
    pages: 1,
    messages: messages,
};

export const dummyMessages = {
    total: 11,
    page: 1,
    pages: 1,
    messages: inManagerDummyInfluencers.map((influencer, index) => {
        return {
            id: influencer.id,
            uid: index + 101,
            emailId: `email_${influencer.id}`,
            threadId: `thread_${influencer.email}`,
            date: influencer.created_at,
            draft: false, // Set to true if it's a draft
            unseen: false, // Set as needed
            flagged: false, // Set as needed
            size: 2356, // Replace with an appropriate value
            subject: `Paid Collab with DJI 🤝`,
            from: {
                name: influencer.manager_first_name,
                address: influencer.email || 'example@example.com',
            },
            replyTo: [],
            to: [
                {
                    address: influencer.email || 'example@example.com',
                },
            ],
            cc: [],
            bcc: [], // Add recipients if needed
            messageId: `message_id_${influencer.id}`, // Use influencer's funnel status as messageId
            inReplyTo: '', // Set if applicable
            flags: ['flag1', 'flag2'], // Replace with relevant flags
            labels: ['label1', 'label2'], // Replace with relevant labels
            attachments: [],
            text: {
                id: `text_${index + 1}`,
                encodedSize: {
                    plain: 1200, // Replace with an appropriate value
                    html: 1800, // Replace with an appropriate value
                },
            },
            preview: 'This is a preview of the email.',
            path: `/inbox/${influencer.email}`, // Replace with appropriate path
        };
    }),
};

dummyMessages.messages.push({
    id: '570c72ba-33c1-4ac7-a237-ced1634a9cd5',
    uid: 101,
    emailId: `email_570c72ba-33c1-4ac7-a237-ced1634a9cd5`,
    threadId: `thread_OutdoorsUnsupervised@gmail.com`,
    date: '2023-08-31T07:01:13.487913+00:00',
    draft: false, // Set to true if it's a draft
    unseen: false, // Set as needed
    flagged: false, // Set as needed
    size: 2356, // Replace with an appropriate value
    subject: `Paid Collab with DJI 🤝`,
    from: {
        name: 'Outdoors Unsupervised',
        address: 'OutdoorsUnsupervised@gmail.com',
    },
    replyTo: [],
    to: [
        {
            address: 'example@example.com',
        },
    ],
    cc: [],
    bcc: [], // Add recipients if needed
    messageId: 'message_id_570c72ba-33c1-4ac7-a237-ced1634a9cd5', // Use influencer's funnel status as messageId
    inReplyTo: '', // Set if applicable
    flags: ['flag1', 'flag2'], // Replace with relevant flags
    labels: ['label1', 'label2'], // Replace with relevant labels
    attachments: [],
    text: {
        id: `text_${4 + 1}`,
        encodedSize: {
            plain: 1200, // Replace with an appropriate value
            html: 1800, // Replace with an appropriate value
        },
    },
    preview: 'This is a preview of the email.',
    path: `/inbox/OutdoorsUnsupervised@gmail.com`, // Replace with appropriate path
});

export const existingThread = [
    {
        threadId: `thread_OutdoorsUnsupervised@gmail.com_1`,
        html: `<p>Hey Outdoors Unsupervised,</p>
        <p>Jim here from DJI. I just saw your <a href="https://www.youtube.com/watch?v=YMM5hpWMK64">"First Time Flying a Drone Stealth Camp #15 Woods and Construction Site"</a> post, and I gotta say, love your content style 🤩.</p> 
        <br>    
        <p>I've got a <a href="https://www.dji.com/au/mavic-3-pro?site=brandsite&from=homepage">Mavic 3 Pro</a> I'd like to send you, have a feeling it's something your audience would be really into!</p>
        <p>The DJI Mavic 3 features next-level imaging performance. Mavic 3 Pro's triple-camera system ushers in a new era of camera drones by housing three sensors and lenses with different focal lengths. Equipped with a Hasselblad camera and dual tele cameras, Mavic 3 Pro is a triple-camera drone that unlocks new shooting perspectives, allowing you to embrace creative freedom further, capture fascinating scenery, explore photographic storytelling, and make cinematic masterpieces.</p>
        <br>
        <p>We’re looking to partner with 8 or so influencers to get the word out about the Mavic 3 Pro over the next couple weeks, and would love for you to be apart of it.</p>
        <p>Let me know if this is something you'd be interested in!</p>
        <br>
        <p>Cheers,</p>
        <br>
        <p>Jim at DJI</p>`,
        plain: `This is the plain text content for thread.`,
    },
    {
        threadId: `thread_OutdoorsUnsupervised@gmail.com_2`,
        html: `<p>Hey Jim, that looks amazing!</p><br/>
        <p>I'd love to collab, let me send you my media kit and we can start planning the video.</p>
        <br/><p>Outdoors Unsupervised</p>`,
        plain: `This is the plain text content for thread.`,
    },
];

export const dummyThread = [
    ...inManagerDummyInfluencers.slice(1).map((influencer) => {
        return {
            threadId: `thread_${influencer.email}`,
            html: `<p>Hey ${influencer.name},</p>
        <p>Jim here from DJI. I just saw your <a href="https://www.youtube.com/watch?v=YMM5hpWMK64">"First Time Flying a Drone Stealth Camp #15 Woods and Construction Site"</a> post, and I gotta say, love your content style 🤩.</p> 
        <br>    
        <p>I've got a <a href="https://www.dji.com/au/mavic-3-pro?site=brandsite&from=homepage">Mavic 3 Pro</a> I'd like to send you, have a feeling it's something your audience would be really into!</p>
        <p>The DJI Mavic 3 features next-level imaging performance. Mavic 3 Pro's triple-camera system ushers in a new era of camera drones by housing three sensors and lenses with different focal lengths. Equipped with a Hasselblad camera and dual tele cameras, Mavic 3 Pro is a triple-camera drone that unlocks new shooting perspectives, allowing you to embrace creative freedom further, capture fascinating scenery, explore photographic storytelling, and make cinematic masterpieces.</p>
        <br>
        <p>We’re looking to partner with 8 or so influencers to get the word out about the Mavic 3 Pro over the next couple weeks, and would love for you to be apart of it.</p>
        <p>Let me know if this is something you'd be interested in!</p>
        <br>
        <p>Cheers,</p>
        <br>
        <p>Jim at DJI</p>`,
            plain: `This is the plain text content for thread.`,
        };
    }),
    ...existingThread,
];
