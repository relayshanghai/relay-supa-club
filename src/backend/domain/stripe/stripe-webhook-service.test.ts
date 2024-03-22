import { type StripeWebhookRequest, StripeWebhookType } from 'pages/api/v2/stripe-webhook/request';
import { StripeWebhookService } from './stripe-webhook-service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CompanyRepository from 'src/backend/database/company/company-repository';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type BillingEventEntity } from 'src/backend/database/billing-event/billing-event-entity';
import { type SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import { logger } from 'src/backend/integration/logger';
import type winston from 'winston';
import { NotFoundError } from 'src/utils/error/http-error';

vi.mock('../company/company-repository');
vi.mock('../billing/billing-event-repository');
vi.mock('../subscription/subscription-repository');
vi.mock('./stripe-service');
vi.mock('../profile/profile-repository');
vi.mock('./slack-service');
vi.mock('../../integration/logger');

describe('StripeWebhookService', () => {
    let stripeWebhookService: StripeWebhookService;

    beforeEach(() => {
        stripeWebhookService = StripeWebhookService.getService();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('handler', () => {
        it('should handle the webhook request and return a success message', async () => {
            // Arrange
            const request = {
                type: StripeWebhookType.CHARGE_SUCCEEDED,
                data: {
                    object: {
                        customer: 'customer_id',
                    },
                },
            } as StripeWebhookRequest;
            const company = {
                id: 'company_id',
            } as CompanyEntity;
            const billingEvent = {
                id: 'billing_event_id',
            } as BillingEventEntity;
            const subscription = {
                id: 'subscription_id',
            } as SubscriptionEntity;

            vi.spyOn(CompanyRepository.getRepository(), 'findOne').mockResolvedValue(company);
            vi.spyOn(BillingEventRepository.getRepository(), 'save').mockResolvedValue(billingEvent);
            vi.spyOn(SubscriptionRepository.getRepository(), 'findOne').mockResolvedValue(subscription);
            vi.spyOn(SubscriptionRepository.getRepository(), 'update').mockResolvedValue({
                generatedMaps: [],
                raw: true,
            });
            vi.spyOn(SubscriptionRepository.getRepository(), 'save').mockResolvedValue(subscription);

            // Act
            const result = await stripeWebhookService.handler(request);

            // Assert
            expect(result).toEqual({ message: 'Webhook received' });
            expect(CompanyRepository.getRepository().findOne).toHaveBeenCalledWith({
                where: {
                    cusId: request.data?.object.customer as string,
                },
            });
            expect(BillingEventRepository.getRepository().save).toHaveBeenCalledWith({
                company,
                data: request.data?.object,
                provider: 'stripe',
                type: request.type,
            });
            expect(SubscriptionRepository.getRepository().update).toHaveBeenCalledWith(
                {
                    company,
                },
                {
                    providerLastEvent: expect.any(String),
                },
            );
        });

        it('should throw an error if the company is not found', async () => {
            // Arrange
            const request = {
                type: StripeWebhookType.CHARGE_SUCCEEDED,
                data: {
                    object: {
                        customer: 'customer_id',
                    },
                },
            } as StripeWebhookRequest;

            vi.spyOn(CompanyRepository.getRepository(), 'findOne').mockResolvedValue(null);
            const loggerMock = vi.spyOn(logger, 'error').mockReturnValue({} as winston.Logger);

            // Act & Assert
            await stripeWebhookService.handler(request);
            expect(loggerMock).toBeCalledWith('Error handling stripe webhook', expect.any(NotFoundError));
        });

        it('should log an error if an exception occurs during handling', async () => {
            // Arrange
            const request = {
                type: StripeWebhookType.CHARGE_SUCCEEDED,
                data: {
                    object: {
                        customer: 'customer_id',
                    },
                },
            } as StripeWebhookRequest;
            const company = {
                id: 'company_id',
            } as CompanyEntity;

            vi.spyOn(CompanyRepository.getRepository(), 'findOne').mockResolvedValue(company);
            vi.spyOn(BillingEventRepository.getRepository(), 'save').mockRejectedValue(new Error('Some error'));

            // Act
            const result = await stripeWebhookService.handler(request);

            // Assert
            expect(result).toEqual({ message: 'Webhook received' });
        });
    });
});
