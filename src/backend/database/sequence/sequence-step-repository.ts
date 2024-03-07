import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { In, type EntityManager, type EntityTarget } from 'typeorm';
import { SequenceStepEntity } from './sequence-step-entity';
import { type OutreachEmailTemplateEntity, Step } from '../sequence-email-template/sequence-email-template-entity';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';

@InjectInitializeDatabaseOnAllProps
export default class SequenceStepRepository extends BaseRepository<SequenceStepEntity> {
    static repository = new SequenceStepRepository();
    static getRepository(): SequenceStepRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceStepRepository>(SequenceStepRepository.name);
            if (contextRepository) {
                return contextRepository as SequenceStepRepository;
            }
            const repository = new SequenceStepRepository(SequenceStepEntity, manager);
            RequestContext.registerRepository(SequenceStepRepository.name, repository);
            return repository;
        }
        return SequenceStepRepository.repository;
    }
    constructor(target: EntityTarget<SequenceStepEntity> = SequenceStepEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async getSequenceStepData(outreachEmailStep: Step) {
        switch (outreachEmailStep) {
            case Step.OUTREACH:
                return { stepName: 'Outreach', waitTimeHours: 0, stepNumber: 0 };
            case Step.FIRST_FOLLOW_UP:
                return { stepName: '1st Follow-up', waitTimeHours: 24, stepNumber: 1 };
            case Step.SECOND_FOLLOW_UP:
                return { stepName: '2nd Follow-up', waitTimeHours: 48, stepNumber: 2 };
            case Step.THIRD_FOLLOW_UP:
                return { stepName: '3rd Follow-up', waitTimeHours: 72, stepNumber: 3 };
            default:
                return { stepName: '', waitTimeHours: 0, stepNumber: 0 };
        }
    }

    async upsertSequenceStep(sequenceId: string, item: OutreachEmailTemplateEntity) {
        const data = await this.getSequenceStepData(item.step);
        const { stepName: name, waitTimeHours, stepNumber } = data;
        const [err, sequenceStep] = await awaitToError(
            this.findOneByOrFail({
                sequence: { id: sequenceId },
                stepNumber,
            }),
        );

        if (err) {
            return this.save({
                sequence: { id: sequenceId },
                outreachEmailTemplate: { id: item.id },
                templateId: item.email_engine_template_id,
                name,
                waitTimeHours,
                stepNumber,
            });
        }
        return this.save({
            ...sequenceStep,
            outreachEmailTemplate: { id: item.id },
            templateId: item.email_engine_template_id,
            name,
            waitTimeHours,
        });
    }

    async removeUnusedSequenceStep(
        sequenceStep: SequenceStepEntity[],
        sequenceTemplates: OutreachEmailTemplateEntity[],
    ) {
        if (sequenceStep.length === 0 || sequenceTemplates.length === 0) {
            return;
        }
        const emailTemplateIdsInSequenceSteps = sequenceStep.map((item) => item.outreachEmailTemplate?.id);
        const emailTemplateIds = sequenceTemplates.map((item) => item.id);
        const diff = emailTemplateIdsInSequenceSteps.filter((id) => !emailTemplateIds.includes(id as string));
        if (diff.length === 0) {
            return;
        }
        await this.delete({
            outreachEmailTemplate: {
                id: In(diff),
            },
        });
    }

    async insertIntoSequenceStep(sequenceId: string, sequenceTemplates: OutreachEmailTemplateEntity[]) {
        // get diff between existing sequence steps and new sequence steps
        const [err, sequenceSteps] = await awaitToError(
            this.find({
                where: { sequence: { id: sequenceId } },
                relations: {
                    outreachEmailTemplate: true,
                },
            }),
        );
        if (err) {
            throw new NotFoundError('Sequence not found');
        }

        if (sequenceSteps.length > sequenceTemplates.length) {
            // delete the diff
            await this.removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
        }

        // insert the new sequence steps
        const newSequenceStep = await Promise.all(
            sequenceTemplates.map((item) => this.upsertSequenceStep(sequenceId, item)),
        );
        return newSequenceStep;
    }
}
