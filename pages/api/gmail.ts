import Imap from 'imap'; // https://github.com/mscdex/node-imap
import nodeMailer from 'nodemailer'; //https://nodemailer.com/usage/
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { PubSub } from '@google-cloud/pubsub';

import { google } from 'googleapis';
import { APP_URL } from 'src/constants';
const OAuth2 = google.auth.OAuth2;
const GOOGLE_EMAIL_CLIENT_ID = process.env.GOOGLE_EMAIL_CLIENT_ID;
const GOOGLE_EMAIL_CLIENT_SECRET = process.env.GOOGLE_EMAIL_CLIENT_SECRET;

if (!GOOGLE_EMAIL_CLIENT_ID || !GOOGLE_EMAIL_CLIENT_SECRET) {
    throw new Error('no google credentials found');
}
const redirectUrl = APP_URL + '/component-previews/gmail';
const projectId = 'relay-emailer-391709';
const topicName = 'projects/relay-emailer-391709/topics/emails'; //set in https://console.cloud.google.com/cloudpubsub/topic/create?project=relay-emailer-391709
/** request the auth url */
const getHandler: NextApiHandler = async (req, res) => {
    const oauth2Client = new OAuth2(GOOGLE_EMAIL_CLIENT_ID, GOOGLE_EMAIL_CLIENT_SECRET, redirectUrl);

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://mail.google.com/',
    });

    return res.json({ url });
};

export interface GmailPostBody {
    code: string;
    userId: string;
    recipient: string;
    content: string;
}

const formatContent = (to: string, body: string, subject = 'Test email') => {
    const email = `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`;
    return Buffer.from(email, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};

const postHandler: NextApiHandler = async (req, res) => {
    const { code, userId, content, recipient } = req.body as GmailPostBody;

    const oauth2Client = new OAuth2(GOOGLE_EMAIL_CLIENT_ID, GOOGLE_EMAIL_CLIENT_SECRET, redirectUrl);
    oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            // Store the refresh_token in your database!
            console.log('refresh_token', tokens.refresh_token);
        }
        console.log('access_token', tokens.access_token);
    });
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log({ tokens });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const emailRes = await gmail.users.messages.send({
        userId: 'me', // 'From' email address. 'me' is the authenticated user
        requestBody: { raw: formatContent(recipient, content) },
    });
    console.log({ emailRes });

    // listen for new emails
    gmail.users.watch(
        {
            userId: 'me',
            requestBody: {
                labelIds: ['INBOX'],
                topicName,
            },
        },
        (err, res) => {
            console.log({ err, res });
        },
    );

    // create a Pub/Sub client object
    const pubsub = new PubSub({ projectId: projectId, auth: oauth2Client as any }); // I think the problem is here
    // error uncaughtException: Error [TypeError]: this.auth.getClient is not a function
    // at GrpcClient._getCredentials
    pubsub.auth;

    // create a subscription to the topic
    const subscription = await pubsub.subscription(topicName);

    // listen for new messages on the subscription
    subscription.on('message', async (message) => {
        const email = await gmail.users.messages.get({
            userId: 'me',
            id: message.attributes['emailId'],
        });
        console.log(email);
        message.ack();
    });
    res.status(httpCodes.OK).json(emailRes);
};

export default ApiHandler({
    postHandler,
    getHandler,
});
