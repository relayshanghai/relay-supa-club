import type { NextApiRequest } from 'next/types';
import type { InsertCompanyPayload, InsertProfilePayload, UpdateCompanyPayload } from 'types';
import { sendSlackMessage } from '.';
import type { SlackMessage } from '.';

//Send a message to the slack channel when a new customer signs up
export const handleNewProfileMessage = async (req: NextApiRequest, URL: string) => {
    const data = req.body as InsertProfilePayload;
    const { first_name: firstName, last_name: lastName, phone, email } = data.record;
    if (data.table === 'profiles' && data.type === 'INSERT') {
        //For how to format Slack message body, see more at https://api.slack.com/messaging/composing/layouts
        const reqBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':office_worker: A new customer has signed up:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Name:*\n${firstName} ${lastName}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Email:*\n${email}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Phone:*\n${phone}`,
                        },
                    ],
                },
            ],
        };
        await sendSlackMessage(URL, reqBody);
    }
};

//Send a message to the slack channel when a new customer signs up
export const handleNewCompanyMessage = async (req: NextApiRequest, URL: string) => {
    const data = req.body as InsertCompanyPayload;
    const {
        name: companyName,
        website,
        subscription_status: subscriptionStatus,
        subscription_current_period_end: subScriptionCurrentPeriodEndDate,
    } = data.record;
    if (!subScriptionCurrentPeriodEndDate) {
        throw new Error('Subscription end date is not found.');
    }
    if (data.table === 'companies' && data.type === 'INSERT') {
        let status;
        const currentDate = new Date();
        if (new Date(subScriptionCurrentPeriodEndDate) < currentDate && subscriptionStatus === 'canceled') {
            status = 'expired';
        } else {
            status = subscriptionStatus;
        }
        const reqBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':office: A new company has been created:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Name:*\n${companyName}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Website:*\n${website}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Subscription Status:*\n${status}`,
                        },
                    ],
                },
            ],
        };
        await sendSlackMessage(URL, reqBody);
    }
};

//Send a message to the slack channel when a company has updated its subscription status
export const handleCompanyUpdateMessage = async (req: NextApiRequest, URL: string) => {
    const data = req.body as UpdateCompanyPayload;
    const { name: companyName, subscription_status: subscriptionStatus } = data.record;
    if (!data.old_record) return; //If the old_record is not present, it means the record is being created for the first time (handled in handleNewCompanyMessage
    const { subscription_status: oldSubscriptionStatus } = data.old_record;
    if (data.table === 'companies' && data.type === 'UPDATE' && oldSubscriptionStatus !== subscriptionStatus) {
        const reqBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':pencil2: A company has been updated:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*${companyName}* has updated its Subscription`,
                        },
                    ],
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `From:\n*${oldSubscriptionStatus}*`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `To:\n*${subscriptionStatus}*`,
                        },
                    ],
                },
            ],
        };
        await sendSlackMessage(URL, reqBody);
    }
};
