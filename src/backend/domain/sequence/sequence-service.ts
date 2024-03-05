import type { SequenceRequest, SequenceTemplate, Variable } from 'pages/api/outreach/sequences/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import ProductRepository from 'src/backend/database/product/product-repository';
import awaitToError from 'src/utils/await-to-error';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { NotFoundError, PreconditionError } from 'src/utils/error/http-error';
import OutreachTemplateRepository from 'src/backend/database/outreach-template-repository';
import SequenceStepRepository from 'src/backend/database/sequence/sequence-step-repository';
import {
    Step,
    type OutreachEmailTemplateEntity,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import TemplateVariableRepository from 'src/backend/database/template-variable/template-variable-repository';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import type { SequenceStepEntity } from 'src/backend/database/sequence/sequence-step-entity';
import { In } from 'typeorm';

export default class SequenceService {
    public static readonly service: SequenceService = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }

    @CompanyIdRequired()
    async create(request: SequenceRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const user = RequestContext.getContext().session?.user;
        const profile = await ProfileRepository.getRepository().findOne({ where: { id: user?.id } });
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await this.checkTemplateStepIsUnique(companyId, sequenceTemplates as SequenceTemplate[]);
        await this.checkTemplateVariables(
            companyId,
            sequenceTemplates as SequenceTemplate[],
            templateVariables as Variable[],
        );

        const [err, product] = await awaitToError(
            ProductRepository.getRepository().findOne({ where: { id: request.productId } }),
        );
        if (err) {
            throw new NotFoundError('Product not found');
        }
        const sequence = await SequenceRepository.getRepository().save({
            ...request,
            company: { id: companyId },
            product: { id: product?.id },
            manager: { id: user?.id },
            managerFirstName: profile?.firstName,
        });
        await this.insertIntoSequenceStep(sequence.id, emailTemplates);
        await this.insertIntoTemplateVariables(sequence.id, templateVariables as Variable[]);
        return sequence;
    }

    @CompanyIdRequired()
    async update(request: SequenceRequest, id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await this.checkTemplateStepIsUnique(companyId, sequenceTemplates as SequenceTemplate[]);
        await this.checkTemplateVariables(
            companyId,
            sequenceTemplates as SequenceTemplate[],
            templateVariables as Variable[],
        );
        const [err, existingSequence] = await awaitToError(
            SequenceRepository.getRepository().findOneOrFail({ where: { id } }),
        );
        if (err) {
            throw new NotFoundError('Sequence not found');
        }

        let product = null;
        if (request.productId) {
            const [err, p] = await awaitToError(
                ProductRepository.getRepository().findOne({ where: { id: request.productId } }),
            );
            if (err) {
                throw new NotFoundError('Product not found');
            }
            product = p;
        }
        const newData = {
            ...existingSequence,
            ...request,
        } as SequenceEntity;
        if (product) {
            newData.product = { id: product?.id } as ProductEntity;
        }
        const sequence = await SequenceRepository.getRepository().save(newData);
        await this.insertIntoSequenceStep(sequence.id, emailTemplates);
        await this.removeAllTemplateVariables(sequence.id);
        await this.insertIntoTemplateVariables(sequence.id, templateVariables as Variable[]);
        return sequence;
    }

    private async checkTemplateStepIsUnique(
        companyId: string,
        sequenceTemplates: SequenceTemplate[],
    ): Promise<OutreachEmailTemplateEntity[]> {
        // iterate sequenceTemplates and get the data from OutreachTemplateRepository.getRepository().get(companyId, id)
        const templates = await Promise.all(
            sequenceTemplates.map((data) => OutreachTemplateRepository.getRepository().get(companyId, data.id)),
        );
        const steps = templates.map((item) => item.step);
        const isUnique = new Set(steps).size === steps.length;
        if (!isUnique) {
            throw new PreconditionError('sequence template step is not unique');
        }
        return templates as OutreachEmailTemplateEntity[];
    }

    private async checkTemplateVariables(
        companyId: string,
        sequenceTemplates: SequenceTemplate[],
        variables: Variable[],
    ) {
        // iterate sequenceTemplates and get the data from OutreachTemplateRepository.getRepository().get(companyId, id)
        const templates = await Promise.all(
            sequenceTemplates.map((data) => OutreachTemplateRepository.getRepository().get(companyId, data.id)),
        );
        const v = templates.map((item) => item.variables);
        const templateVariables = v.map((item) => item.map((variable) => variable.outreach_template_variables));
        templateVariables.forEach((templateItems) => {
            const fullfilledVariables = templateItems
                .map((item) => {
                    return variables.find((v) => v.name === item.name);
                })
                // filter out undefined
                .filter((item) => item);
            const isFullfilled = fullfilledVariables.length === templateItems.length;
            if (!isFullfilled) {
                throw new PreconditionError('sequence template variables is not fullfilled');
            }
        });
        // return isFullfilled;
        return false;
    }

    private getSequenceStepData(outreachEmailStep: Step) {
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

    private async upsertSequenceStep(sequenceId: string, item: OutreachEmailTemplateEntity) {
        const { stepName: name, waitTimeHours, stepNumber } = this.getSequenceStepData(item.step);
        const [err, sequenceStep] = await awaitToError(
            SequenceStepRepository.getRepository().findOneByOrFail({
                sequence: { id: sequenceId },
                stepNumber,
            }),
        );

        if (err) {
            return SequenceStepRepository.getRepository().save({
                sequence: { id: sequenceId },
                outreachEmailTemplate: { id: item.id },
                templateId: item.email_engine_template_id,
                name,
                waitTimeHours,
                stepNumber,
            });
        }
        return SequenceStepRepository.getRepository().save({
            ...sequenceStep,
            outreachEmailTemplate: { id: item.id },
            templateId: item.email_engine_template_id,
            name,
            waitTimeHours,
        });
    }

    private async removeUnusedSequenceStep(
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
        await SequenceStepRepository.getRepository().delete({
            outreachEmailTemplate: {
                id: In(diff),
            },
        });
    }

    private async insertIntoSequenceStep(sequenceId: string, sequenceTemplates: OutreachEmailTemplateEntity[]) {
        // get diff between existing sequence steps and new sequence steps
        const [err, sequenceSteps] = await awaitToError(
            SequenceStepRepository.getRepository().find({
                where: { sequence: { id: sequenceId } },
                relations: {
                    outreachEmailTemplate: true,
                },
            }),
        );
        if (err) {
            throw new NotFoundError('Sequence not found');
        }
        // delete the diff
        await this.removeUnusedSequenceStep(sequenceSteps, sequenceTemplates);
        // insert the new sequence steps
        const newSequenceStep = await Promise.all(
            sequenceTemplates.map((item) => this.upsertSequenceStep(sequenceId, item)),
        );
        return newSequenceStep;
    }

    private async insertIntoTemplateVariables(sequenceId: string, variables: Variable[]) {
        const sequenceSteps = await Promise.all(
            variables.map((item) => {
                return TemplateVariableRepository.getRepository().save({
                    sequence: { id: sequenceId },
                    name: item.name,
                    key: item.name,
                    value: item.value,
                });
            }),
        );
        return sequenceSteps;
    }

    private removeAllTemplateVariables(sequenceId: string) {
        return TemplateVariableRepository.getRepository().delete({ sequence: { id: sequenceId } });
    }
}
