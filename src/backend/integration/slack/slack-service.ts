import axios from 'axios';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { type SlackMessage } from 'src/utils/api/slack';
import type Stripe from 'stripe';
import StripeService from '../stripe/stripe-service';

const slackSignupWebhook = process.env.SLACK_ACCOUNT_SIGNUPS as string;
const slackAccountSubscriptionUpdates = process.env.SLACK_ACCOUNT_SUBSCRIPTION_UPDATES as string;
const slackAccountSubscriptionCancellations = process.env.SLACK_ACCOUNT_SUBSCRIPTION_CANCELLATIONS as string;
const slackAccountTrialEnding = process.env.SLACK_ACCOUNT_TRIAL_ENDING as string;

export default class SlackService {
    static service = new SlackService();
    static getService = () => SlackService.service;

    private client = axios.create();
    private sendMessage(url: string, message: SlackMessage) {
        return this.client.post(url, message);
    }

    async sendSignupMessage({ company, profile }: { company: CompanyEntity; profile: ProfileEntity }) {
        const messageBody: SlackMessage = {
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
        await this.sendMessage(slackSignupWebhook, messageBody);
    }

    async sendChangePlanMessage({
        company,
        profile,
        newSubscription,
        oldSubscription,
    }: {
        company: CompanyEntity;
        profile: ProfileEntity;
        newSubscription: Stripe.Subscription;
        oldSubscription: Stripe.Subscription;
    }) {
        const newPrice = newSubscription.items.data[0].price;
        const oldPrice = oldSubscription.items.data[0].price;
        const newPriceAmount = newPrice.unit_amount as number;
        const oldPriceAmount = oldPrice.unit_amount as number;
        const newProduct = await StripeService.getService().getProduct(newPrice.product as string);
        const oldProduct = await StripeService.getService().getProduct(oldPrice.product as string);
        let status = ``;
        if (newPriceAmount > oldPriceAmount) {
            status = `UPGRADED`;
        } else if (newPriceAmount < oldPriceAmount) {
            status = `DOWNGRADED`;
        }
        const messageBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${oldProduct.name.toUpperCase()} USER ${status} TO ${newProduct.name.toUpperCase()}`,
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
        await this.sendMessage(slackAccountSubscriptionUpdates, messageBody);
    }

    async sendTrialEndingMessage({
        company,
        profile,
        trialDayExpiring,
    }: {
        company: CompanyEntity;
        profile: ProfileEntity;
        trialDayExpiring: number;
    }) {
        const messageBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `TRIAL EXPIRING IN ${trialDayExpiring} DAY${trialDayExpiring > 1 ? 'S' : ''}`,
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
        await this.sendMessage(slackAccountTrialEnding, messageBody);
    }

    async sendFailedRecurringMessage({
        company,
        profile,
        paymentIntent,
        message = 'Failed to charge the payment method',
    }: {
        company: CompanyEntity;
        profile: ProfileEntity;
        paymentIntent: string;
        message?: string;
    }) {
        const messageBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `RECURRING PAYMENT HAS FAILED`,
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `Message: *${message}*`,
                        },
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
                            text: `Payment Intent: https://dashboard.stripe.com/payments/${paymentIntent}`,
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
        await this.sendMessage(slackAccountSubscriptionUpdates, messageBody);
    }

    async sendCancelSubscriptionMessage({
        company,
        profile,
        subscription,
    }: {
        company: CompanyEntity;
        profile: ProfileEntity;
        subscription: Stripe.Subscription;
    }) {
        const newPrice = subscription.items.data[0].price;
        const newProduct = await StripeService.getService().getProduct(newPrice.product as string);
        const messageBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${newProduct.name.toUpperCase()} USER HAS REQUESTED TO CANCEL THEIR PLAN`,
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `Cancels At: *${new Date((subscription.cancel_at as number) + 1000)}*`,
                        },
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
        await this.sendMessage(slackAccountSubscriptionCancellations, messageBody);
    }

    async sendResumeSubscriptionMessage({
        company,
        profile,
        subscription,
    }: {
        company: CompanyEntity;
        profile: ProfileEntity;
        subscription: Stripe.Subscription;
    }) {
        const newPrice = subscription.items.data[0].price;
        const newProduct = await StripeService.getService().getProduct(newPrice.product as string);
        const messageBody: SlackMessage = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${newProduct.name.toUpperCase()} USER HAS REVOKED THEIR CANCEL REQUEST`,
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `Next Payment: *${new Date(subscription.current_period_end + 1000)}*`,
                        },
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
        await this.sendMessage(slackAccountSubscriptionCancellations, messageBody);
    }
}
