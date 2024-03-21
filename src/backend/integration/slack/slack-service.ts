import axios from 'axios';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { type SlackMessage } from 'src/utils/api/slack';

const slackSignupWebhook = process.env.SLACK_ACCOUNT_SIGNUPS as string;

export default class SlackService {
    static service = new SlackService();
    static getService = () => SlackService.service;

    private client = axios.create();
    private sendMessage(url: string, message: SlackMessage) {
        return this.client.post(url, message);
    }

    async sendSignupMessage({ company }: { company: CompanyEntity }) {
        const profile = company.profiles ? company.profiles[0] : ({} as ProfileEntity);
        const reqBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'NEW SIGNUP',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `Company Name: *${company.name}*`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `Stripe Account: https://dashboard.stripe.com/customers/${company.cusId}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `User Name: *${profile.firstName} ${profile.lastName}*`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `Email: *${profile.email}*`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `Phone: *${profile.phone}*`,
                        },
                    ],
                },
            ],
        };
        await this.sendMessage(slackSignupWebhook, reqBody);
    }
}
