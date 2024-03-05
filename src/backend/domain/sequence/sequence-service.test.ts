import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import awaitToError from 'src/utils/await-to-error';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import ProductRepository from 'src/backend/database/product/product-repository';
import SequenceService from './sequence-service';
import { NotFoundError } from 'src/utils/error/http-error';
import OutreachTemplateRepository from 'src/backend/database/outreach-template-repository';
import SequenceStepRepository from 'src/backend/database/sequence/sequence-step-repository';
import { type SequenceRequest } from 'pages/api/outreach/sequences/request';
import TemplateVariableRepository from 'src/backend/database/template-variable/template-variable-repository';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import type { SequenceStepEntity } from 'src/backend/database/sequence/sequence-step-entity';

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

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

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
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const findSequenceStepMock = vi.spyOn(SequenceStepRepository.getRepository(), 'find');
                findSequenceStepMock.mockResolvedValue([]);

                const findOneOrFailSequenceStepMock = vi.spyOn(
                    SequenceStepRepository.getRepository(),
                    'findOneByOrFail',
                );
                findOneOrFailSequenceStepMock.mockRejectedValue(new NotFoundError('Sequence step not found'));

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const templateVariable = vi.spyOn(TemplateVariableRepository.getRepository(), 'save');
                templateVariable.mockResolvedValue({
                    id: 'template_variable_1',
                    key: 'test_one',
                    name: 'test_one',
                    value: 'Test 1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const result = await SequenceService.getService().create({
                    name: 'new sequence',
                    productId: 'product_1',
                    sequenceTemplates: [
                        {
                            id: 'outreach_template_1',
                        },
                    ],
                    variables: [
                        {
                            name: 'test_one',
                            value: 'Test 1',
                        },
                        {
                            name: 'test_two',
                            value: 'Test 2',
                        },
                        {
                            name: 'test_three',
                            value: 'Test 3',
                        },
                    ],
                    autoStart: false,
                });
                expect(result).toEqual({
                    name: 'new sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: { id: 'company_1' },
                    product: { id: 'product_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                });
                expect(SequenceRepository.getRepository().save).toBeCalledWith({
                    name: 'new sequence',
                    productId: 'product_1',
                    autoStart: false,
                    company: { id: 'company_1' },
                    product: { id: 'product_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    sequenceTemplates: [{ id: 'outreach_template_1' }],
                    variables: [
                        {
                            name: 'test_one',
                            value: 'Test 1',
                        },
                        {
                            name: 'test_two',
                            value: 'Test 2',
                        },
                        {
                            name: 'test_three',
                            value: 'Test 3',
                        },
                    ],
                });
            });

            it('should throw validation error when email template step is not unique', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

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
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const [err] = await awaitToError(
                    SequenceService.getService().create({
                        name: 'sequence 1',
                        productId: 'product_1',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                            {
                                id: 'outreach_template_2',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_one',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_two',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_three',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    } as SequenceRequest),
                );
                expect(err.message).toBe('sequence template step is not unique');
            });

            it('should throw validation error when variable is not contained in email template', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

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
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const [err] = await awaitToError(
                    SequenceService.getService().create({
                        name: 'new sequence',
                        productId: 'product_1',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_1',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_2',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_3',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    }),
                );
                expect(err.message).toBe('sequence template variables is not fullfilled');
            });

            it('should throw not found error when product does not exists', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const findOneProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOne');
                findOneProductMock.mockRejectedValue(new NotFoundError('Product not found'));

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
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const [err] = await awaitToError(
                    SequenceService.getService().create({
                        name: 'new sequence',
                        productId: 'product_1',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_one',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_two',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_three',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    }),
                );
                expect(err.message).toBe('Product not found');
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

        describe('update', () => {
            afterEach(() => {
                vi.resetAllMocks();
            });

            it('should update sequence when request is valid', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const mockSequenceData = {
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: {
                        id: 'company_1',
                    } as CompanyEntity,
                    product: {
                        id: 'product_1',
                    } as ProductEntity,
                    manager: {
                        id: 'user_1',
                    } as ProfileEntity,
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };

                const findOneSequenceMock = vi.spyOn(SequenceRepository.getRepository(), 'findOneOrFail');
                findOneSequenceMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

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

                const updateSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                updateSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const findSequenceStepMock = vi.spyOn(SequenceStepRepository.getRepository(), 'find');
                findSequenceStepMock.mockResolvedValue([
                    { id: 'sequence_step_1' } as SequenceStepEntity,
                    { id: 'sequence_step_2' } as SequenceStepEntity,
                ]);

                const findOneOrFailSequenceStepMock = vi.spyOn(
                    SequenceStepRepository.getRepository(),
                    'findOneByOrFail',
                );
                findOneOrFailSequenceStepMock.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                } as SequenceStepEntity);

                const removeAllSequenceStepsMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                removeAllSequenceStepsMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });
                const removeAllTemplateVariablesMock = vi.spyOn(TemplateVariableRepository.getRepository(), 'delete');
                removeAllTemplateVariablesMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const templateVariable = vi.spyOn(TemplateVariableRepository.getRepository(), 'save');
                templateVariable.mockResolvedValue({
                    id: 'template_variable_1',
                    key: 'test_one',
                    name: 'test_one',
                    value: 'Test 1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const result = await SequenceService.getService().update(
                    {
                        name: 'new updated sequence',
                        productId: 'product_1',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_one',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_two',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_three',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    },
                    'sequence_id_1',
                );

                expect(removeAllSequenceStepsMock).toBeCalled();
                expect(removeAllTemplateVariablesMock).toBeCalled();
                expect(result).toEqual({
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: { id: 'company_1' },
                    product: { id: 'product_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                });
                expect(SequenceRepository.getRepository().save).toBeCalledWith({
                    name: 'new updated sequence',
                    productId: 'product_1',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                    autoStart: false,
                    company: { id: 'company_1' },
                    product: { id: 'product_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    sequenceTemplates: [{ id: 'outreach_template_1' }],
                    variables: [
                        {
                            name: 'test_one',
                            value: 'Test 1',
                        },
                        {
                            name: 'test_two',
                            value: 'Test 2',
                        },
                        {
                            name: 'test_three',
                            value: 'Test 3',
                        },
                    ],
                });
            });

            it('wont call get product when product id not in request', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const mockSequenceData = {
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: {
                        id: 'company_1',
                    } as CompanyEntity,
                    manager: {
                        id: 'user_1',
                    } as ProfileEntity,
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };

                const findOneSequenceMock = vi.spyOn(SequenceRepository.getRepository(), 'findOneOrFail');
                findOneSequenceMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

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

                const updateSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                updateSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const findSequenceStepMock = vi.spyOn(SequenceStepRepository.getRepository(), 'find');
                findSequenceStepMock.mockResolvedValue([
                    { id: 'sequence_step_1' } as SequenceStepEntity,
                    { id: 'sequence_step_2' } as SequenceStepEntity,
                ]);

                const findOneOrFailSequenceStepMock = vi.spyOn(
                    SequenceStepRepository.getRepository(),
                    'findOneByOrFail',
                );
                findOneOrFailSequenceStepMock.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                } as SequenceStepEntity);

                const removeAllSequenceStepsMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                removeAllSequenceStepsMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });
                const removeAllTemplateVariablesMock = vi.spyOn(TemplateVariableRepository.getRepository(), 'delete');
                removeAllTemplateVariablesMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const templateVariable = vi.spyOn(TemplateVariableRepository.getRepository(), 'save');
                templateVariable.mockResolvedValue({
                    id: 'template_variable_1',
                    key: 'test_one',
                    name: 'test_one',
                    value: 'Test 1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const result = await SequenceService.getService().update(
                    {
                        name: 'new updated sequence',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_one',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_two',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_three',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    },
                    'sequence_id_1',
                );

                expect(removeAllSequenceStepsMock).toBeCalled();
                expect(removeAllTemplateVariablesMock).toBeCalled();
                expect(findOneProductMock).not.toBeCalled();
                expect(result).toEqual({
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: { id: 'company_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                });
                expect(SequenceRepository.getRepository().save).toBeCalledWith({
                    name: 'new updated sequence',
                    productId: 'product_1',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                    autoStart: false,
                    company: { id: 'company_1' },
                    manager: { id: 'user_1' },
                    managerFirstName: 'John',
                    sequenceTemplates: [{ id: 'outreach_template_1' }],
                    variables: [
                        {
                            name: 'test_one',
                            value: 'Test 1',
                        },
                        {
                            name: 'test_two',
                            value: 'Test 2',
                        },
                        {
                            name: 'test_three',
                            value: 'Test 3',
                        },
                    ],
                });
            });

            it('should throw not found error when sequence does not exists', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const findOneSequenceMock = vi.spyOn(SequenceRepository.getRepository(), 'findOneOrFail');
                findOneSequenceMock.mockRejectedValue(new NotFoundError('Sequence not found'));

                const [err] = await awaitToError(
                    SequenceService.getService().update(
                        {
                            name: 'new updated sequence',
                            productId: 'product_1',
                            sequenceTemplates: [
                                {
                                    id: 'outreach_template_1',
                                },
                            ],
                            variables: [
                                {
                                    name: 'test_one',
                                    value: 'Test 1',
                                },
                                {
                                    name: 'test_two',
                                    value: 'Test 2',
                                },
                                {
                                    name: 'test_three',
                                    value: 'Test 3',
                                },
                            ],
                            autoStart: false,
                        },
                        'sequence_id_1',
                    ),
                );
                expect(err.message).toBe('Sequence not found');
            });

            it('should throw validation error when email template step is not unique', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const mockSequenceData = {
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: {
                        id: 'company_1',
                    } as CompanyEntity,
                    product: {
                        id: 'product_1',
                    } as ProductEntity,
                    manager: {
                        id: 'user_1',
                    } as ProfileEntity,
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };

                const findOneSequenceMock = vi.spyOn(SequenceRepository.getRepository(), 'findOneOrFail');
                findOneSequenceMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

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

                const updateSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                updateSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const removeAllSequenceStepsMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                removeAllSequenceStepsMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });
                const removeAllTemplateVariablesMock = vi.spyOn(TemplateVariableRepository.getRepository(), 'delete');
                removeAllTemplateVariablesMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const templateVariable = vi.spyOn(TemplateVariableRepository.getRepository(), 'save');
                templateVariable.mockResolvedValue({
                    id: 'template_variable_1',
                    key: 'test_one',
                    name: 'test_one',
                    value: 'Test 1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const [err] = await awaitToError(
                    SequenceService.getService().update(
                        {
                            name: 'new updated sequence',
                            productId: 'product_1',
                            sequenceTemplates: [
                                {
                                    id: 'outreach_template_1',
                                },
                                {
                                    id: 'outreach_template_2',
                                },
                            ],
                            variables: [
                                {
                                    name: 'test_one',
                                    value: 'Test 1',
                                },
                                {
                                    name: 'test_two',
                                    value: 'Test 2',
                                },
                                {
                                    name: 'test_three',
                                    value: 'Test 3',
                                },
                            ],
                            autoStart: false,
                        },
                        'sequence_id_1',
                    ),
                );

                expect(err.message).toBe('sequence template step is not unique');
            });

            it('should throw validation error when variable is not contained in email template', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const mockSequenceData = {
                    name: 'new updated sequence',
                    productId: 'product_1',
                    sequenceTemplates: [],
                    variables: [],
                    autoStart: false,
                    company: {
                        id: 'company_1',
                    } as CompanyEntity,
                    product: {
                        id: 'product_1',
                    } as ProductEntity,
                    manager: {
                        id: 'user_1',
                    } as ProfileEntity,
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };

                const findOneSequenceMock = vi.spyOn(SequenceRepository.getRepository(), 'findOneOrFail');
                findOneSequenceMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

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

                const updateSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                updateSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const removeAllSequenceStepsMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                removeAllSequenceStepsMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });
                const removeAllTemplateVariablesMock = vi.spyOn(TemplateVariableRepository.getRepository(), 'delete');
                removeAllTemplateVariablesMock.mockResolvedValue({
                    raw: {},
                    affected: 1,
                });

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new updated sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const templateVariable = vi.spyOn(TemplateVariableRepository.getRepository(), 'save');
                templateVariable.mockResolvedValue({
                    id: 'template_variable_1',
                    key: 'test_one',
                    name: 'test_one',
                    value: 'Test 1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const [err] = await awaitToError(
                    SequenceService.getService().update(
                        {
                            name: 'new updated sequence',
                            productId: 'product_1',
                            sequenceTemplates: [
                                {
                                    id: 'outreach_template_1',
                                },
                            ],
                            variables: [
                                {
                                    name: 'test_1',
                                    value: 'Test 1',
                                },
                                {
                                    name: 'test_2',
                                    value: 'Test 2',
                                },
                                {
                                    name: 'test_3',
                                    value: 'Test 3',
                                },
                            ],
                            autoStart: false,
                        },
                        'sequence_id_1',
                    ),
                );

                expect(err.message).toBe('sequence template variables is not fullfilled');
            });

            it('should throw not found error when product does not exists', async () => {
                const profileMock = vi.spyOn(ProfileRepository.getRepository(), 'findOne');
                profileMock.mockResolvedValue({ firstName: 'John' } as ProfileEntity);

                const outreachEmailMock = vi.spyOn(OutreachTemplateRepository.getRepository(), 'get');
                outreachEmailMock.mockResolvedValue({
                    id: 'outreach_template_1',
                    name: 'outreach_template_name_1',
                    description: 'outreach_template_description_1',
                    step: 'OUTREACH',
                    subject: 'outreach_template_subject_1',
                    variables: [
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_1',
                                name: 'test_one',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_2',
                                name: 'test_two',
                            },
                        },
                        {
                            outreach_template_variables: {
                                id: 'outreach_template_variable_3',
                                name: 'test_three',
                            },
                        },
                    ],
                } as any);

                const findOneProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOne');
                findOneProductMock.mockRejectedValue(new NotFoundError('Product not found'));

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
                    managerFirstName: 'John',
                    id: 'sequence_id_1',
                    createdAt: '2024-02-29T08:58:59.251Z',
                    updatedAt: '2024-02-29T08:58:59.251Z',
                    deleted: false,
                };
                const createSequenceResultMock = vi.spyOn(SequenceRepository.getRepository(), 'save');
                createSequenceResultMock.mockResolvedValue(mockSequenceData as unknown as SequenceEntity);

                const sequenceStepRepository = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                sequenceStepRepository.mockResolvedValue({
                    name: 'new sequence',
                    stepNumber: 1,
                    waitTimeHours: 24,
                    templateId: 'outreach_template_1',
                    sequence: { id: 'sequence_id_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: 'sequence_id_1',
                });

                const [err] = await awaitToError(
                    SequenceService.getService().create({
                        name: 'new sequence',
                        productId: 'product_1',
                        sequenceTemplates: [
                            {
                                id: 'outreach_template_1',
                            },
                        ],
                        variables: [
                            {
                                name: 'test_one',
                                value: 'Test 1',
                            },
                            {
                                name: 'test_two',
                                value: 'Test 2',
                            },
                            {
                                name: 'test_three',
                                value: 'Test 3',
                            },
                        ],
                        autoStart: false,
                    }),
                );
                expect(err.message).toBe('Product not found');
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
