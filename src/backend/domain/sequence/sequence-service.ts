import type {
    SequenceRequest,
    GetSequenceRequest,
    SequenceTemplate,
    Variable,
    GetSequenceResponse,
} from 'pages/api/v2/outreach/sequences/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import awaitToError from 'src/utils/await-to-error';
import { BadRequestError, NotFoundError } from 'src/utils/error/http-error';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import ProductRepository from 'src/backend/database/product/product-repository';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import SequenceStepRepository from 'src/backend/database/sequence/sequence-step-repository';
import TemplateVariableRepository from 'src/backend/database/template-variable/template-variable-repository';
import OutreachEmailTemplateRepository from 'src/backend/database/sequence-email-template/sequence-email-template-repository';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import { type GetInfluencersRequest } from 'pages/api/v2/outreach/sequences/[sequenceId]/requests';
import type { SendRequest } from 'pages/api/v2/sequences/[id]/schedule/request';
import JobRepository from 'src/backend/database/job/job-repository';
import { JobEntity, JobQueueType } from 'src/backend/database/job/job-entity';
import { v4 } from 'uuid';
import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';

export default class SequenceService {
    public static readonly service: SequenceService = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }

    @CompanyIdRequired()
    async get(request: GetSequenceRequest): Promise<GetSequenceResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const { sequences, totalCount } = await SequenceRepository.getRepository().getSequences({
            ...request,
            companyId,
        });
        if (request.page * request.size > totalCount) {
            throw new NotFoundError('No sequences found at this page number');
        }
        return {
            page: request.page,
            size: request.size,
            totalItems: totalCount,
            items: sequences.map((sequence) => ({
                id: sequence.id,
                name: sequence.name,
                product: sequence.product as ProductEntity,
                autoStart: sequence.autoStart,
                totalInfluencers: sequence.totalInfluencers,
            })),
        };
    }

    @UseTransaction()
    @CompanyIdRequired()
    async create(request: SequenceRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const user = RequestContext.getContext().session?.user;
        const profile = await ProfileRepository.getRepository().findOne({ where: { id: user?.id } });
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
            companyId,
            sequenceTemplates as SequenceTemplate[],
        );
        await OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
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
        await SequenceStepRepository.getRepository().insertIntoSequenceStep(sequence.id, emailTemplates);
        await TemplateVariableRepository.getRepository().insertIntoTemplateVariables(
            sequence.id,
            templateVariables as Variable[],
        );
        return sequence;
    }

    @CompanyIdRequired()
    async getSequenceInfluencers(request: GetInfluencersRequest, sequenceId: string) {
        const sequence = await SequenceRepository.getRepository().findOneOrFail({ where: { id: sequenceId } });
        if (!sequence) {
            throw new NotFoundError('Invalid sequenceID');
        }
        const sequenceInfluencers =
            await SequenceInfluencerRepository.getRepository().getSequenceInfluencersBySequenceId({
                ...request,
                sequenceId,
            });
        if (!sequenceInfluencers) {
            throw new NotFoundError('No influencers found at given page');
        }
        return sequenceInfluencers;
    }

    async moveManager(originalProfile: ProfileEntity, newProfile: ProfileEntity) {
        await SequenceRepository.getRepository().moveManager(originalProfile, newProfile);
    }

    @UseTransaction()
    @CompanyIdRequired()
    async update(request: SequenceRequest, id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
            companyId,
            sequenceTemplates as SequenceTemplate[],
        );
        await OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
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
        if (sequenceTemplates?.length && sequenceTemplates?.length > 0) {
            await SequenceStepRepository.getRepository().insertIntoSequenceStep(sequence.id, emailTemplates);
        }
        if (templateVariables?.length && templateVariables?.length > 0) {
            await TemplateVariableRepository.getRepository().delete({ sequence: { id: sequence.id } });
            await TemplateVariableRepository.getRepository().insertIntoTemplateVariables(
                sequence.id,
                templateVariables as Variable[],
            );
        }
        return sequence;
    }

    @UseTransaction()
    @CompanyIdRequired()
    async send(sequenceId: string, body: SendRequest) {
        const profile = RequestContext.getContext().profile;
        const emailEngineAccountId = profile?.emailEngineAccountId;
        const sequenceInfluencers = body.sequenceInfluencersIds;
        if (!emailEngineAccountId) {
            throw new BadRequestError('Cannot get email account');
        }
        const { templateVariables, steps: sequenceSteps } = await SequenceRepository.getRepository().findOneOrFail({
            where: { id: sequenceId },
            relations: {
                steps: {
                    outreachEmailTemplate: true,
                },
                templateVariables: true,
            },
        });
        if (templateVariables.length === 0) {
            throw new BadRequestError('No template variables found');
        }
        const steps = sequenceSteps.sort((a, b) => a.stepNumber - b.stepNumber);
        if (steps.length === 0) {
            throw new BadRequestError('No sequence steps found');
        }
        const firstStep = sequenceSteps.find((step) => step.stepNumber === 0);
        if (!firstStep) {
            throw new BadRequestError('No first step found');
        }

        const data = await Promise.allSettled(
            sequenceInfluencers
                .map(async (d) => {
                    const influencer = await SequenceInfluencerRepository.getRepository().findOneOrFail({
                        where: { id: d },
                        relations: { influencerSocialProfile: true, company: true, sequence: true, address: true },
                    });
                    const result = await SequenceInfluencerRepository.getRepository().save({
                        ...influencer,
                        funnelStatus: 'In Sequence',
                        name: influencer.name ?? '',
                        username: influencer.username ?? '',
                        avatarUrl: influencer.avatarUrl ?? '',
                        url: influencer.url ?? '',
                        platform: influencer.platform ?? '',
                    });
                    return result;
                })
                .map(async (d) => {
                    const influencer = await d;
                    if (!influencer.influencerSocialProfile?.id) {
                        throw new BadRequestError('No influencer social profile id');
                    }
                    if (!influencer.email) {
                        throw new BadRequestError('No email address');
                    }
                    if (!influencer.name && !influencer.username) {
                        throw new BadRequestError('No influencer name or handle');
                    }
                    if (!influencer.influencerSocialProfile.recentPostUrl) {
                        throw new BadRequestError('No recent post URL');
                    }
                    return influencer;
                }),
        );
        const influencersDetails = data
            .filter((d) => d.status === 'fulfilled')
            .map(
                (d: PromiseFulfilledResult<SequenceInfluencerEntity> | PromiseRejectedResult) =>
                    (d as PromiseFulfilledResult<SequenceInfluencerEntity>).value as SequenceInfluencerEntity,
            );

        const jobPayloads: SequenceStepSendArgs[] = [];
        for (const influencer of influencersDetails) {
            // still use old payload
            const payload: SequenceStepSendArgs = {
                emailEngineAccountId,
                sequenceStep: {
                    id: firstStep.id,
                    name: firstStep.name as any,
                    wait_time_hours: firstStep.waitTimeHours,
                    outreach_email_template_id: firstStep.outreachEmailTemplate?.email_engine_template_id as string,
                    sequence_id: firstStep.sequence?.id,
                    step_number: firstStep.stepNumber,
                    template_id: firstStep.outreachEmailTemplate?.email_engine_template_id as string,
                    created_at: new Date(firstStep.createdAt).toISOString(),
                    updated_at: new Date(firstStep.updatedAt).toISOString(),
                },
                sequenceSteps: sequenceSteps.map((d) => ({
                    id: d.id,
                    name: d.name as any,
                    wait_time_hours: d.waitTimeHours,
                    outreach_email_template_id: d.outreachEmailTemplate?.email_engine_template_id as string,
                    sequence_id: d.sequence?.id,
                    step_number: d.stepNumber,
                    template_id: d.outreachEmailTemplate?.id as string,
                    created_at: d.createdAt.toISOString(),
                    updated_at: d.updatedAt.toISOString(),
                })),
                sequenceInfluencer: {
                    id: influencer.id,
                    created_at: influencer.createdAt.toISOString(),
                    updated_at: influencer.createdAt.toISOString(),
                    added_by: influencer.addedBy,
                    email: influencer.email ?? null,
                    sequence_step: influencer.sequenceStep,
                    funnel_status: influencer.funnelStatus as any,
                    tags: influencer.tags,
                    next_step: influencer.nextStep ?? null,
                    scheduled_post_date: influencer.scheduledPostDate?.toISOString() ?? null,
                    video_details: influencer.videoDetails ?? null,
                    rate_amount: influencer.rateAmount ?? null,
                    rate_currency: influencer.rateCurrency ?? null,
                    real_full_name: influencer.realFullName ?? null,
                    company_id: influencer.company.id,
                    sequence_id: influencer.sequence.id,
                    address_id: influencer.address?.id ?? null,
                    address: influencer.address ?? null,
                    influencer_social_profile_id: influencer.influencerSocialProfile?.id ?? null,
                    iqdata_id: influencer.iqdataId,
                    avatar_url: influencer.avatarUrl ?? null,
                    name: influencer.name ?? null,
                    platform: influencer.platform as any,
                    social_profile_last_fetched: influencer.socialProfileLastFetched?.toISOString() ?? null,
                    url: influencer.url ?? null,
                    username: influencer.username ?? null,
                    affiliate_link: influencer.affiliateLink ?? null,
                    commission_rate: null,
                    recent_post_title: influencer.influencerSocialProfile?.recentPostTitle ?? '',
                    recent_post_url: influencer.influencerSocialProfile?.recentPostUrl ?? '',
                    manager_first_name: influencer.sequence.managerFirstName,
                },
                templateVariables: [
                    ...templateVariables.map((d) => ({
                        id: d.id,
                        name: d.name,
                        value: d.value,
                        sequence_id: d.sequence?.id,
                        created_at: new Date(d.createdAt).toISOString(),
                        updated_at: new Date(d.updatedAt).toISOString(),
                        required: d.required,
                        key: d.key,
                    })),
                ],
                jobId: v4(),
            };
            jobPayloads.push(payload);
        }
        const result = await Promise.all(
            jobPayloads.map((payload) =>
                JobRepository.getRepository().save(
                    new JobEntity({
                        id: payload.jobId,
                        name: JobQueueType.SEQUENCE_STEP_SEND,
                        queue: JobQueueType.SEQUENCE_STEP_SEND,
                        // to make sure it runs on old scheduler
                        runAt: new Date(new Date().getTime() - 7 * 60 * 60 * 1000),
                        payload,
                        owner: profile,
                    }),
                ),
            ),
        );

        return { ...result };
    }
}
