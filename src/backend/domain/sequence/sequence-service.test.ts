import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import awaitToError from 'src/utils/await-to-error';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import ProductRepository from 'src/backend/database/product/product-repository';
import SequenceService from './sequence-service';

describe('src/backend/domain/sequence/sequence-service.ts', () => {
    const getContextMock = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        RequestContext.getContext = getContextMock;
        getContextMock.mockReturnValue({
            companyId: 'company_1',
            requestUrl: 'https://example.com',
            session: { user: { id: 'user_1' } },
        });
    });
    describe('SequenceService', () => {
        describe('create', () => {
            afterEach(() => {
                vi.resetAllMocks();
            });
            it('should create sequence when request is valid', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const findOneProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOne');
                findOneProductMock.mockResolvedValue({
                    id: `product_1`,
                    name: `product_name_1`,
                    description: `product_description_1`,
                    price: 100,
                    shopUrl: `https://example1.com`,
                    priceCurrency: 'USD',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const mockSequenceData = {
                    name: 'new sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: {
                        id: 'company_1',
                    },
                    product: {
                        id: 'product_1',
                    },
                    manager: {
                        id: 'user_1',
                    },
                    managerFirstName: 'Jacob',
                    id: '90c311f2-4a8c-4bea-8f10-50f64047463f',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const result = await SequenceService.getService().create({
                    name: 'new sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                });
                expect(result).toEqual(mockSequenceData);
                expect(SequenceRepository.getRepository().save).toBeCalledWith({
                    name: 'new sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: { id: 'company_1' },
                    product: { id: 'product_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                });
            });
            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    SequenceService.getService().create({
                        name: 'new sequence',
                        productId: 'product_1',
                        sequenceTemplates: [],
                        variables: [],
                        autoStart: false,
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
        });
    });
});
