import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, it, vi, expect } from 'vitest';
import OutreachEmailTemplateRepository from './sequence-email-template-repository';
import { type OutreachEmailTemplateEntity, Step } from './sequence-email-template-entity';
import awaitToError from 'src/utils/await-to-error';
import { PreconditionError } from 'src/utils/error/http-error';
import { In, IsNull } from 'typeorm';
import { type Variable } from 'pages/api/v2/outreach/sequences/request';

describe('src/backend/database/sequence-email-template/sequence-email-template-repository.ts', () => {
    const getContextMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();

        RequestContext.getContext = getContextMock;
        getContextMock.mockReturnValue({
            companyId: 'company_1',
            requestUrl: 'https://example.com',
            session: { user: { id: 'user_1' } },
        });
    });
    describe('OutreachEmailTemplateRepository', () => {
        describe('checkTemplateStepIsUnique', () => {
            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should create new sequence step data', async () => {
                const findMock = vi
                    .spyOn(OutreachEmailTemplateRepository.getRepository(), 'find')
                    .mockResolvedValue([
                        { id: 'template_1', step: Step.OUTREACH } as OutreachEmailTemplateEntity,
                        { id: 'template_2', step: Step.FIRST_FOLLOW_UP } as OutreachEmailTemplateEntity,
                    ]);
                const sequenceTemplates = [
                    { id: 'template_1', step: Step.OUTREACH },
                    { id: 'template_2', step: Step.FIRST_FOLLOW_UP },
                ];
                const result = await OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
                    'company_1',
                    sequenceTemplates,
                );
                expect(findMock).toHaveBeenCalledWith({
                    where: {
                        company: [{ id: 'company_1' }, { id: IsNull() }],
                        id: In(['template_1', 'template_2']),
                    },
                });
                expect(result).toEqual([
                    { id: 'template_1', step: Step.OUTREACH } as OutreachEmailTemplateEntity,
                    { id: 'template_2', step: Step.FIRST_FOLLOW_UP } as OutreachEmailTemplateEntity,
                ]);
            });

            it('should throw error sequence template step is not unique', async () => {
                const findMock = vi
                    .spyOn(OutreachEmailTemplateRepository.getRepository(), 'find')
                    .mockResolvedValue([
                        { id: 'template_1', step: Step.OUTREACH } as OutreachEmailTemplateEntity,
                        { id: 'template_2', step: Step.OUTREACH } as OutreachEmailTemplateEntity,
                    ]);
                const sequenceTemplates = [
                    { id: 'template_1', step: Step.OUTREACH },
                    { id: 'template_2', step: Step.OUTREACH },
                ];
                const [err] = await awaitToError(
                    OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
                        'company_1',
                        sequenceTemplates,
                    ),
                );
                expect(findMock).toHaveBeenCalledWith({
                    where: {
                        company: [{ id: 'company_1' }, { id: IsNull() }],
                        id: In(['template_1', 'template_2']),
                    },
                });

                expect(err).toEqual(new PreconditionError('sequence template step is not unique'));
            });
        });

        describe('checkTemplateVariables', () => {
            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should create new sequence step data', async () => {
                const findMock = vi.spyOn(OutreachEmailTemplateRepository.getRepository(), 'find').mockResolvedValue([
                    {
                        id: 'template_1',
                        step: Step.OUTREACH,
                        variables: [
                            {
                                name: 'variable_1',
                            },
                        ],
                    } as OutreachEmailTemplateEntity,
                    {
                        id: 'template_2',
                        step: Step.FIRST_FOLLOW_UP,
                        variables: [
                            {
                                name: 'variable_2',
                            },
                        ],
                    } as OutreachEmailTemplateEntity,
                ]);
                const sequenceTemplates = [
                    { id: 'template_1', step: Step.OUTREACH },
                    { id: 'template_2', step: Step.FIRST_FOLLOW_UP },
                ];
                const variables = [{ name: 'variable_1' }, { name: 'variable_2' }] as Variable[];

                const result = await OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
                    'company_1',
                    sequenceTemplates,
                    variables,
                );

                expect(findMock).toHaveBeenCalledWith({
                    where: {
                        company: [{ id: 'company_1' }, { id: IsNull() }],
                        id: In(['template_1', 'template_2']),
                    },
                    relations: {
                        variables: true,
                    },
                });
                expect(result).toEqual(true);
            });

            it('should throw error sequence template variables is not fullfilled', async () => {
                const findMock = vi.spyOn(OutreachEmailTemplateRepository.getRepository(), 'find').mockResolvedValue([
                    {
                        id: 'template_1',
                        step: Step.OUTREACH,
                        variables: [
                            {
                                name: 'variable_1',
                            },
                        ],
                    } as OutreachEmailTemplateEntity,
                    {
                        id: 'template_2',
                        step: Step.FIRST_FOLLOW_UP,
                        variables: [
                            {
                                name: 'variable_2',
                            },
                        ],
                    } as OutreachEmailTemplateEntity,
                    {
                        id: 'template_3',
                        step: Step.SECOND_FOLLOW_UP,
                        variables: [
                            {
                                name: 'variable_3',
                            },
                        ],
                    } as OutreachEmailTemplateEntity,
                ]);
                const sequenceTemplates = [
                    { id: 'template_1', step: Step.OUTREACH },
                    { id: 'template_2', step: Step.FIRST_FOLLOW_UP },
                ];
                const variables = [{ name: 'variable_1' }, { name: 'variable_2' }] as Variable[];

                const [err] = await awaitToError(
                    OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
                        'company_1',
                        sequenceTemplates,
                        variables,
                    ),
                );

                expect(findMock).toHaveBeenCalledWith({
                    where: {
                        company: [{ id: 'company_1' }, { id: IsNull() }],
                        id: In(['template_1', 'template_2']),
                    },
                    relations: {
                        variables: true,
                    },
                });
                expect(err).toEqual(new PreconditionError('sequence template variables is not fullfilled'));
            });
        });
    });
});
