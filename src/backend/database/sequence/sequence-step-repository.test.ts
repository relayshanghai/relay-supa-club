import { RequestContext } from 'src/utils/request-context/request-context';
import { beforeAll, afterEach, beforeEach, describe, it, vi, expect } from 'vitest';
import { type SequenceStepEntity } from './sequence-step-entity';
import { type OutreachEmailTemplateEntity, Step } from '../sequence-email-template/sequence-email-template-entity';
import SequenceStepRepository from './sequence-step-repository';
import { In } from 'typeorm';
import { type SequenceEntity } from './sequence-entity';

describe('src/backend/database/sequence/sequence-step-repository.ts', () => {
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
    describe('SequenceStepRepository', () => {
        describe('upsertSequenceStep', () => {
            let sequenceTemplates: OutreachEmailTemplateEntity[];
            beforeAll(() => {
                sequenceTemplates = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                    {
                        id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                        name: 'test 1',
                        description: '',
                        step: Step.FIRST_FOLLOW_UP,
                        template: '<p>test</p>',
                        subject: 'test 1',
                        email_engine_template_id: 'AAABjftZ3g8AAAAe',
                    },
                ];
            });

            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should create new sequence step data', async () => {
                const findOneOrFailMock = vi.spyOn(SequenceStepRepository.getRepository(), 'findOneByOrFail');
                findOneOrFailMock.mockRejectedValue(new Error('not found'));
                const saveMock = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                saveMock.mockResolvedValue({
                    id: 'sequence_1',
                    templateId: 'template_1',
                    outreachEmailTemplate: { id: 'outreach_template_description_1' } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await SequenceStepRepository.getRepository().upsertSequenceStep('sequence_1', sequenceTemplates[0]);
                expect(findOneOrFailMock).toHaveBeenCalledWith({
                    sequence: { id: 'sequence_1' },
                    stepNumber: 0,
                });
                expect(saveMock).toHaveBeenCalledWith({
                    sequence: { id: 'sequence_1' },
                    outreachEmailTemplate: { id: '2f4abc24-21d4-44bb-8357-6d688629abf0' },
                    templateId: 'AAABjfe3nKsAAAAc',
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                });
            });

            it('should update existing sequence step data', async () => {
                const findOneOrFailMock = vi.spyOn(SequenceStepRepository.getRepository(), 'findOneByOrFail');
                findOneOrFailMock.mockResolvedValue({
                    id: 'sequence_1',
                    templateId: 'template_1',
                    outreachEmailTemplate: {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                    } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                } as SequenceStepEntity);
                const saveMock = vi.spyOn(SequenceStepRepository.getRepository(), 'save');
                saveMock.mockResolvedValue({
                    id: 'sequence_1',
                    templateId: 'AAABjfe3nKsAAAAc',
                    outreachEmailTemplate: {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                    } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                } as SequenceStepEntity);
                await SequenceStepRepository.getRepository().upsertSequenceStep('sequence_1', sequenceTemplates[0]);
                expect(findOneOrFailMock).toHaveBeenCalledWith({
                    sequence: { id: 'sequence_1' },
                    stepNumber: 0,
                });
                expect(saveMock).toHaveBeenCalledWith({
                    id: 'sequence_1',
                    templateId: 'AAABjfe3nKsAAAAc',
                    outreachEmailTemplate: {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                    } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                });
            });
        });

        describe('getSequenceStepData', () => {
            it('should return sequence step data with Outreach step name', async () => {
                const data = await SequenceStepRepository.getRepository().getSequenceStepData(Step.OUTREACH);
                expect(data).toEqual({ stepName: 'Outreach', waitTimeHours: 0, stepNumber: 0 });
            });

            it('should return sequence step data with 1st Follow-up step name', async () => {
                const data = await SequenceStepRepository.getRepository().getSequenceStepData(Step.FIRST_FOLLOW_UP);
                expect(data).toEqual({ stepName: '1st Follow-up', waitTimeHours: 24, stepNumber: 1 });
            });
            it('should return sequence step data with 2nd Follow-up step name', async () => {
                const data = await SequenceStepRepository.getRepository().getSequenceStepData(Step.SECOND_FOLLOW_UP);
                expect(data).toEqual({ stepName: '2nd Follow-up', waitTimeHours: 48, stepNumber: 2 });
            });
            it('should return sequence step data with 3rd Follow-up step name', async () => {
                const data = await SequenceStepRepository.getRepository().getSequenceStepData(Step.THIRD_FOLLOW_UP);
                expect(data).toEqual({ stepName: '3rd Follow-up', waitTimeHours: 72, stepNumber: 3 });
            });
        });

        describe('removeUnusedSequenceStep', () => {
            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should remove unused sequence step', async () => {
                const sequenceSteps: SequenceStepEntity[] = [
                    {
                        id: '2b1df772-827c-4d34-ba85-fd22a9a2ee01',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'Outreach',
                        waitTimeHours: 0,
                        templateId: 'AAABjfe3nKsAAAAc',
                        stepNumber: 0,
                        outreachEmailTemplate: {
                            id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                            name: 'test 2',
                            description: '',
                            step: Step.OUTREACH,
                            template: '<p>test</p>',
                            subject: 'test 2',
                            email_engine_template_id: 'AAABjfe3nKsAAAAc',
                        },
                    } as SequenceStepEntity,
                    {
                        id: 'ae542be2-642a-4ad6-bc5b-80b7a4644589',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: '1st Follow-up',
                        waitTimeHours: 24,
                        templateId: 'AAABjftZ3g8AAAAe',
                        stepNumber: 1,
                        outreachEmailTemplate: {
                            id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                            name: 'test 4_1',
                            description: '',
                            step: Step.FIRST_FOLLOW_UP,
                            template: '<p>test</p>',
                            subject: 'test 4',
                            email_engine_template_id: 'AAABjftZ3g8AAAAe',
                        },
                    } as SequenceStepEntity,
                ];
                const sequenceTemplates: OutreachEmailTemplateEntity[] = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                ];
                const deleteMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                deleteMock.mockResolvedValue({
                    affected: 1,
                    raw: '',
                });
                await SequenceStepRepository.getRepository().removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
                expect(deleteMock).toHaveBeenCalledWith({
                    outreachEmailTemplate: {
                        id: In(['aef2e5a4-6ca6-478e-ab17-59fc64e52882']),
                    },
                });
            });

            it('should not remove unused sequence step', async () => {
                const sequenceSteps: SequenceStepEntity[] = [
                    {
                        id: '2b1df772-827c-4d34-ba85-fd22a9a2ee01',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'Outreach',
                        waitTimeHours: 0,
                        templateId: 'AAABjfe3nKsAAAAc',
                        stepNumber: 0,
                        outreachEmailTemplate: {
                            id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                            name: 'test 2',
                            description: '',
                            step: Step.OUTREACH,
                            template: '<p>test</p>',
                            subject: 'test 2',
                            email_engine_template_id: 'AAABjfe3nKsAAAAc',
                        },
                    } as SequenceStepEntity,
                    {
                        id: 'ae542be2-642a-4ad6-bc5b-80b7a4644589',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: '1st Follow-up',
                        waitTimeHours: 24,
                        templateId: 'AAABjftZ3g8AAAAe',
                        stepNumber: 1,
                        outreachEmailTemplate: {
                            id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                            name: 'test 4_1',
                            description: '',
                            step: Step.FIRST_FOLLOW_UP,
                            template: '<p>test</p>',
                            subject: 'test 4',
                            email_engine_template_id: 'AAABjftZ3g8AAAAe',
                        },
                    } as SequenceStepEntity,
                ];
                const sequenceTemplates: OutreachEmailTemplateEntity[] = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                    {
                        id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                        name: 'test 1',
                        description: '',
                        step: Step.FIRST_FOLLOW_UP,
                        template: '<p>test</p>',
                        subject: 'test 1',
                        email_engine_template_id: 'AAABjftZ3g8AAAAe',
                    },
                ];
                const deleteMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                deleteMock.mockResolvedValue({
                    affected: 0,
                    raw: '',
                });
                await SequenceStepRepository.getRepository().removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
                expect(deleteMock).not.toHaveBeenCalled();
            });

            it('should not remove unused sequence step when sequence step is empty', async () => {
                const sequenceSteps: SequenceStepEntity[] = [];
                const sequenceTemplates: OutreachEmailTemplateEntity[] = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                    {
                        id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                        name: 'test 1',
                        description: '',
                        step: Step.FIRST_FOLLOW_UP,
                        template: '<p>test</p>',
                        subject: 'test 1',
                        email_engine_template_id: 'AAABjftZ3g8AAAAe',
                    },
                ];
                const deleteMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                deleteMock.mockResolvedValue({
                    affected: 0,
                    raw: '',
                });
                await SequenceStepRepository.getRepository().removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
                expect(deleteMock).not.toHaveBeenCalled();
            });

            it('should not remove unused sequence step when sequence templates is empty', async () => {
                const sequenceSteps: SequenceStepEntity[] = [
                    {
                        id: '2b1df772-827c-4d34-ba85-fd22a9a2ee01',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'Outreach',
                        waitTimeHours: 0,
                        templateId: 'AAABjfe3nKsAAAAc',
                        stepNumber: 0,
                        outreachEmailTemplate: {
                            id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                            name: 'test 2',
                            description: '',
                            step: Step.OUTREACH,
                            template: '<p>test</p>',
                            subject: 'test 2',
                            email_engine_template_id: 'AAABjfe3nKsAAAAc',
                        },
                    } as SequenceStepEntity,
                    {
                        id: 'ae542be2-642a-4ad6-bc5b-80b7a4644589',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: '1st Follow-up',
                        waitTimeHours: 24,
                        templateId: 'AAABjftZ3g8AAAAe',
                        stepNumber: 1,
                        outreachEmailTemplate: {
                            id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                            name: 'test 4_1',
                            description: '',
                            step: Step.FIRST_FOLLOW_UP,
                            template: '<p>test</p>',
                            subject: 'test 4',
                            email_engine_template_id: 'AAABjftZ3g8AAAAe',
                        },
                    } as SequenceStepEntity,
                ];
                const sequenceTemplates: OutreachEmailTemplateEntity[] = [];
                const deleteMock = vi.spyOn(SequenceStepRepository.getRepository(), 'delete');
                deleteMock.mockResolvedValue({
                    affected: 0,
                    raw: '',
                });
                await SequenceStepRepository.getRepository().removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
                expect(deleteMock).not.toHaveBeenCalled();
            });
        });

        describe('insertIntoSequenceStep', () => {
            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should do upsert with delete sequence step first', async () => {
                const sequenceSteps = [
                    {
                        id: '2b1df772-827c-4d34-ba85-fd22a9a2ee01',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'Outreach',
                        waitTimeHours: 0,
                        templateId: 'AAABjfe3nKsAAAAc',
                        stepNumber: 0,
                        outreachEmailTemplate: {
                            id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                            name: 'test 2',
                            description: '',
                            step: Step.OUTREACH,
                            template: '<p>test</p>',
                            subject: 'test 2',
                            email_engine_template_id: 'AAABjfe3nKsAAAAc',
                        },
                    } as SequenceStepEntity,
                    {
                        id: 'ae542be2-642a-4ad6-bc5b-80b7a4644589',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: '1st Follow-up',
                        waitTimeHours: 24,
                        templateId: 'AAABjftZ3g8AAAAe',
                        stepNumber: 1,
                        outreachEmailTemplate: {
                            id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                            name: 'test 4_1',
                            description: '',
                            step: Step.FIRST_FOLLOW_UP,
                            template: '<p>test</p>',
                            subject: 'test 4',
                            email_engine_template_id: 'AAABjftZ3g8AAAAe',
                        },
                    } as SequenceStepEntity,
                ];
                const mockFind = vi.spyOn(SequenceStepRepository.getRepository(), 'find');
                mockFind.mockResolvedValue(sequenceSteps);

                const upsertSequenceStepMock = vi.spyOn(SequenceStepRepository.getRepository(), 'upsertSequenceStep');
                upsertSequenceStepMock.mockResolvedValue({
                    id: 'sequence_1',
                    templateId: 'template_1',
                    outreachEmailTemplate: { id: 'outreach_template_description_1' } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const removeUnusedSequenceStepMock = vi.spyOn(
                    SequenceStepRepository.getRepository(),
                    'removeUnusedSequenceStep',
                );
                removeUnusedSequenceStepMock.mockResolvedValue();

                const sequenceTemplates: OutreachEmailTemplateEntity[] = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                ];

                await SequenceStepRepository.getRepository().insertIntoSequenceStep('sequence_1', sequenceTemplates);
                expect(removeUnusedSequenceStepMock).toHaveBeenCalledWith(sequenceSteps, sequenceTemplates);
                expect(upsertSequenceStepMock).toHaveBeenCalledWith('sequence_1', sequenceTemplates[0]);
            });

            it('should not remove unused sequence step when sequence step is empty', async () => {
                const sequenceSteps = [
                    {
                        id: '2b1df772-827c-4d34-ba85-fd22a9a2ee01',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'Outreach',
                        waitTimeHours: 0,
                        templateId: 'AAABjfe3nKsAAAAc',
                        stepNumber: 0,
                        outreachEmailTemplate: {
                            id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                            name: 'test 2',
                            description: '',
                            step: Step.OUTREACH,
                            template: '<p>test</p>',
                            subject: 'test 2',
                            email_engine_template_id: 'AAABjfe3nKsAAAAc',
                        },
                    } as SequenceStepEntity,
                    {
                        id: 'ae542be2-642a-4ad6-bc5b-80b7a4644589',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: '1st Follow-up',
                        waitTimeHours: 24,
                        templateId: 'AAABjftZ3g8AAAAe',
                        stepNumber: 1,
                        outreachEmailTemplate: {
                            id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                            name: 'test 4_1',
                            description: '',
                            step: Step.FIRST_FOLLOW_UP,
                            template: '<p>test</p>',
                            subject: 'test 4',
                            email_engine_template_id: 'AAABjftZ3g8AAAAe',
                        },
                    } as SequenceStepEntity,
                ];
                const mockFind = vi.spyOn(SequenceStepRepository.getRepository(), 'find');
                mockFind.mockResolvedValue(sequenceSteps);

                const upsertSequenceStepMock = vi.spyOn(SequenceStepRepository.getRepository(), 'upsertSequenceStep');
                upsertSequenceStepMock.mockResolvedValue({
                    id: 'sequence_1',
                    templateId: 'template_1',
                    outreachEmailTemplate: { id: 'outreach_template_description_1' } as OutreachEmailTemplateEntity,
                    name: 'Outreach',
                    waitTimeHours: 0,
                    stepNumber: 0,
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const removeUnusedSequenceStepMock = vi.spyOn(
                    SequenceStepRepository.getRepository(),
                    'removeUnusedSequenceStep',
                );
                removeUnusedSequenceStepMock.mockResolvedValue();

                const sequenceTemplates: OutreachEmailTemplateEntity[] = [
                    {
                        id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                        name: 'test 2',
                        description: '',
                        step: Step.OUTREACH,
                        template: '<p>test</p>',
                        subject: 'test 2',
                        email_engine_template_id: 'AAABjfe3nKsAAAAc',
                    },
                    {
                        id: 'aef2e5a4-6ca6-478e-ab17-59fc64e52882',
                        name: 'test 1',
                        description: '',
                        step: Step.FIRST_FOLLOW_UP,
                        template: '<p>test</p>',
                        subject: 'test 1',
                        email_engine_template_id: 'AAABjftZ3g8AAAAe',
                    },
                ];

                await SequenceStepRepository.getRepository().insertIntoSequenceStep('sequence_1', sequenceTemplates);
                expect(removeUnusedSequenceStepMock).not.toHaveBeenCalled();
                expect(upsertSequenceStepMock).toHaveBeenCalledWith('sequence_1', sequenceTemplates[0]);
                expect(upsertSequenceStepMock).toHaveBeenCalledWith('sequence_1', sequenceTemplates[1]);
            });
        });
    });
});
