import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import SubscriptionService from './subscription';
import awaitToError from 'src/utils/await-to-error';
import { BadRequestError } from 'src/utils/error/http-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import * as hostUtil from 'src/utils/get-host';

describe('src/backend/domain/subscription/subscription.test.ts', () => {
    describe('SubscriptionService', () => {
        beforeEach(() => {
            vi.resetAllMocks();
            const getContextMock = vi.fn();
            RequestContext.getContext = getContextMock;
            getContextMock.mockReturnValue({
                customerId: 'cus_1',
                companyId: 'company_1',
                request: {
                    headers: {
                        ['x-forwarded-for']: 'https://app.example.com',
                        ['user-agent']: 'someAgent',
                    },
                },
            });
        });
        const stripeClientSubscriptionListMock = vi.fn();
        stripeClient.subscriptions.list = stripeClientSubscriptionListMock;
        const stripeClientSubscriptionUpdateMock = vi.fn();
        stripeClient.subscriptions.update = stripeClientSubscriptionUpdateMock;
        describe('upgradeSubscription()', () => {
            beforeEach(() => {
                stripeClientSubscriptionListMock.mockResolvedValue({
                    data: [
                        {
                            id: 'sub_1',
                            items: {
                                data: [
                                    {
                                        id: 'item_1',
                                        price: {
                                            id: 'price_1',
                                        },
                                    },
                                ],
                            },
                            status: 'active',
                        },
                    ],
                });
                stripeClientSubscriptionUpdateMock.mockResolvedValue({
                    id: 'sub_1',
                });
            });

            it('should throw BadRequestError when stripe does not listed any subcription plan', async () => {
                const subscriptionService = SubscriptionService.getService();

                stripeClientSubscriptionListMock.mockResolvedValue({
                    data: [
                        {
                            id: 'sub_1',
                            items: {
                                data: [
                                    {
                                        id: 'item_1',
                                        price: {
                                            id: 'price_2',
                                        },
                                    },
                                ],
                            },
                            status: 'active',
                        },
                    ],
                });
                const [err] = await awaitToError(subscriptionService.upgradeSubscription('price_2'));
                expect(err).to.be.instanceOf(BadRequestError);
                expect(err.message).to.be.equal('You are already subscribed to this plan');
                expect(stripeClientSubscriptionUpdateMock).not.toBeCalled();
            });

            it('should throw BadRequestError when stripe already subscribed to the new subcription plan', async () => {
                const subscriptionService = SubscriptionService.getService();

                stripeClientSubscriptionListMock.mockResolvedValue({
                    data: [],
                });
                const [err] = await awaitToError(subscriptionService.upgradeSubscription('price_2'));
                expect(err).to.be.instanceOf(BadRequestError);
                expect(err.message).to.be.equal('You are not subscribed to any plan');
                expect(stripeClientSubscriptionUpdateMock).not.toBeCalled();
            });

            it('should upgrade the subscription when request is valid', async () => {
                const subscriptionService = SubscriptionService.getService();
                const response = await subscriptionService.upgradeSubscription('price_2');
                expect(stripeClientSubscriptionUpdateMock).toBeCalledWith('sub_1', {
                    expand: ['latest_invoice.payment_intent'],
                    items: [
                        {
                            deleted: true,
                            id: 'item_1',
                        },
                        {
                            price: 'price_2',
                        },
                    ],
                    off_session: true,
                });
                expect(response).to.be.undefined;
            });
        });
        describe('setupIntent()', () => {
            const getHostnameFromRequestMock = vi.spyOn(hostUtil, 'getHostnameFromRequest');
            const stripePaymentMethodCreatedMock = vi.fn();
            stripeClient.paymentMethods.create = stripePaymentMethodCreatedMock;
            const stripeClientSetupIntentListMock = vi.fn();
            stripeClient.setupIntents.list = stripeClientSetupIntentListMock;
            const stripeClientSetupIntentCreateMock = vi.fn();
            stripeClient.setupIntents.create = stripeClientSetupIntentCreateMock;
            const stripeClientPaymentMethodAttachMock = vi.fn();
            stripeClient.paymentMethods.attach = stripeClientPaymentMethodAttachMock;
            const stripeClientCustomerUpdateMock = vi.fn();
            stripeClient.customers.update = stripeClientCustomerUpdateMock;
            const stripeClientSubscriptionCreateMock = vi.fn();
            stripeClient.subscriptions.create = stripeClientSubscriptionCreateMock;
            beforeEach(() => {
                getHostnameFromRequestMock.mockReturnValue({
                    appUrl: 'https://app.example.com',
                    hostname: 'example.com',
                });
                stripePaymentMethodCreatedMock.mockResolvedValue({
                    id: 'pm_1',
                });
                stripeClientSetupIntentListMock.mockResolvedValue({
                    data: [],
                });
                stripeClientSetupIntentCreateMock.mockResolvedValue({
                    id: 'si_1',
                });
                stripeClientPaymentMethodAttachMock.mockResolvedValue({
                    id: 'pm_1',
                });
                stripeClientCustomerUpdateMock.mockResolvedValue({
                    id: 'cus_1',
                });
                stripeClientSubscriptionCreateMock.mockResolvedValue({
                    id: 'sub_1',
                });
            });
            it('should create new setup intent when no setup intent existed', async () => {
                const subscriptionService = SubscriptionService.getService();
                await subscriptionService.setupIntent('card', 'price_1', 'usd', 'standard');
                expect(stripePaymentMethodCreatedMock).toBeCalledWith({
                    type: 'card',
                });
                expect(stripeClientPaymentMethodAttachMock).toBeCalledWith('pm_1', {
                    customer: 'cus_1',
                });
                expect(stripeClientCustomerUpdateMock).toBeCalledWith('cus_1', {
                    invoice_settings: {
                        default_payment_method: 'pm_1',
                    },
                });
                expect(stripeClientSetupIntentCreateMock).toBeCalledWith(
                    {
                        confirm: true,
                        customer: 'cus_1',
                        mandate_data: {
                            customer_acceptance: {
                                online: {
                                    ip_address: 'https://app.example.com',
                                    user_agent: 'someAgent',
                                },
                                type: 'online',
                            },
                        },
                        payment_method: 'pm_1',
                        payment_method_options: {
                            alipay: {
                                currency: 'usd',
                            },
                        },
                        payment_method_types: ['card'],
                        return_url:
                            'https://app.example.com/payments/confirm-alipay?customerId=cus_1&priceId=price_1&companyId=company_1&selectedPlan=standard',
                        usage: 'off_session',
                    },
                    undefined,
                );
            });
            it('should create new setup intent when setup intent existed with not succeeded status', async () => {
                const subscriptionService = SubscriptionService.getService();
                stripeClientSetupIntentListMock.mockResolvedValue({
                    data: [
                        {
                            id: 'si_1',
                            status: 'request_action',
                        },
                    ],
                });
                await subscriptionService.setupIntent('card', 'price_1', 'usd', 'standard');
                expect(stripePaymentMethodCreatedMock).toBeCalledWith({
                    type: 'card',
                });
                expect(stripeClientPaymentMethodAttachMock).toBeCalledWith('pm_1', {
                    customer: 'cus_1',
                });
                expect(stripeClientCustomerUpdateMock).toBeCalledWith('cus_1', {
                    invoice_settings: {
                        default_payment_method: 'pm_1',
                    },
                });
                expect(stripeClientSetupIntentCreateMock).toBeCalledWith(
                    {
                        confirm: true,
                        customer: 'cus_1',
                        mandate_data: {
                            customer_acceptance: {
                                online: {
                                    ip_address: 'https://app.example.com',
                                    user_agent: 'someAgent',
                                },
                                type: 'online',
                            },
                        },
                        payment_method: 'pm_1',
                        payment_method_options: {
                            alipay: {
                                currency: 'usd',
                            },
                        },
                        payment_method_types: ['card'],
                        return_url:
                            'https://app.example.com/payments/confirm-alipay?customerId=cus_1&priceId=price_1&companyId=company_1&selectedPlan=standard',
                        usage: 'off_session',
                    },
                    undefined,
                );
                expect(stripeClientSubscriptionCreateMock).not.toBeCalled();
            });
            it('should trigger create subcription when setup intent existed with succeeded status', async () => {
                const subscriptionService = SubscriptionService.getService();
                stripeClientSetupIntentListMock.mockResolvedValue({
                    data: [
                        {
                            id: 'si_1',
                            status: 'succeeded',
                        },
                    ],
                });
                await subscriptionService.setupIntent('card', 'price_1', 'usd', 'standard');
                expect(stripePaymentMethodCreatedMock).not.toBeCalled();
                expect(stripeClientPaymentMethodAttachMock).not.toBeCalled();
                expect(stripeClientCustomerUpdateMock).not.toBeCalled();
                expect(stripeClientSetupIntentCreateMock).not.toBeCalled();
                expect(stripeClientSubscriptionCreateMock).toBeCalledWith({
                    coupon: undefined,
                    customer: 'cus_1',
                    expand: ['latest_invoice.payment_intent'],
                    items: [
                        {
                            price: 'price_1',
                        },
                    ],
                    off_session: true,
                    payment_settings: {
                        payment_method_types: ['alipay'],
                        save_default_payment_method: 'on_subscription',
                    },
                });
            });
            it('should trigger create subcription with coupon when setup intent existed with succeeded status and couponid provided', async () => {
                const subscriptionService = SubscriptionService.getService();
                stripeClientSetupIntentListMock.mockResolvedValue({
                    data: [
                        {
                            id: 'si_1',
                            status: 'succeeded',
                        },
                    ],
                });
                await subscriptionService.setupIntent('card', 'price_1', 'usd', 'standard', 'some-coupon-id');
                expect(stripePaymentMethodCreatedMock).not.toBeCalled();
                expect(stripeClientPaymentMethodAttachMock).not.toBeCalled();
                expect(stripeClientCustomerUpdateMock).not.toBeCalled();
                expect(stripeClientSetupIntentCreateMock).not.toBeCalled();
                expect(stripeClientSubscriptionCreateMock).toBeCalledWith({
                    coupon: 'some-coupon-id',
                    customer: 'cus_1',
                    expand: ['latest_invoice.payment_intent'],
                    items: [
                        {
                            price: 'price_1',
                        },
                    ],
                    off_session: true,
                    payment_settings: {
                        payment_method_types: ['alipay'],
                        save_default_payment_method: 'on_subscription',
                    },
                });
            });
        });
    });
});
