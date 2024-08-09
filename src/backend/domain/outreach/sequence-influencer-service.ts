import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import { AddressRepository } from 'src/backend/database/influencer/address-repository';
import { BadRequestError, NotFoundError } from 'src/utils/error/http-error';
import type { UpdateAddressRequest } from 'pages/api/v2/sequence-influencers/[id]/addresses/request';
import type { UpdateSequenceInfluencerRequest } from 'pages/api/v2/sequence-influencers/[id]/request';
import { type AddInfluencerRequest } from 'pages/api/v2/sequences/[id]/influencers/request';
import { In, Not } from 'typeorm';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import { type GetSequenceInfluencerRequest } from 'pages/api/v2/sequences/[id]/influencers/get-influencer-request';

export default class SequenceInfluencerService {
    static service = new SequenceInfluencerService();
    static getService(): SequenceInfluencerService {
        return SequenceInfluencerService.service;
    }
    @CompanyIdRequired()
    @UseLogger()
    async update(sequenceInfluencerId: string, request: UpdateSequenceInfluencerRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        await SequenceInfluencerRepository.getRepository().update(
            {
                id: sequenceInfluencerId,
                company: { id: companyId },
            },
            request,
        );
    }

    @CompanyIdRequired()
    @UseLogger()
    async getSequenceInfluencerAddress(sequenceInfluencerId: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const address = await AddressRepository.getRepository().findOne({
            where: {
                sequenceInfluencers: {
                    id: sequenceInfluencerId,
                    company: { id: companyId },
                },
            },
        });
        if (!address) throw new NotFoundError('Address not found');
        return address;
    }
    @CompanyIdRequired()
    @UseLogger()
    async updateSequenceInfluencerAddress(sequenceInfluencerId: string, request: UpdateAddressRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequenceInfluencer = await SequenceInfluencerRepository.getRepository().findOne({
            where: {
                id: sequenceInfluencerId,
            },
            relations: {
                influencerSocialProfile: true,
            },
        });
        if (!sequenceInfluencer) throw new NotFoundError('Sequence influencer not found');
        const address = await AddressRepository.getRepository().findOne({
            where: {
                sequenceInfluencers: {
                    id: sequenceInfluencerId,
                    company: { id: companyId },
                },
            },
        });
        if (!address) {
            const createdAddress = await AddressRepository.getRepository().create({
                ...request,
                influencerSocialProfile: sequenceInfluencer?.influencerSocialProfile,
            });
            await SequenceInfluencerRepository.getRepository().update(
                {
                    id: sequenceInfluencerId,
                },
                {
                    address: createdAddress,
                },
            );
            return;
        }
        await AddressRepository.getRepository().update(
            {
                id: address.id,
            },
            request,
        );
    }

    @CompanyIdRequired()
    async addInfluencerToSequence(sequenceId: string, ...request: AddInfluencerRequest[]) {
        const count = await SequenceInfluencerRepository.getRepository().count({
            where: {
                sequence: { id: sequenceId },
                funnelStatus: Not('Negotiating'),
            },
        });
        const { profile, translation: t } = RequestContext.getContext();
        if (count + request.length >= 300) {
            throw new BadRequestError(t('sequences.influencerLimit', { influencerLimit: `300` }));
        }
        const existedInfluencers = await SequenceInfluencerRepository.getRepository().find({
            where: {
                iqdataId: In(request.map((r) => r.iqdataId)),
            },
        });
        const toInsert = request.map((r) => {
            const existed = existedInfluencers.find((e) => e.iqdataId === r.iqdataId);
            return {
                sequence: { id: sequenceId },
                addedBy: profile?.id,
                company: {
                    id: profile?.company?.id,
                },
                avatarUrl: r.avatarUrl,
                iqdataId: r.iqdataId,
                funnelStatus: 'To Contact',
                rateAmount: r.rateAmount,
                sequenceStep: r.sequenceStep,
                platform: r.platform,
                url: r.url,
                name: r.name,
                username: r.username,
                email: existed?.email,
                tags: existed?.tags,
                socialProfileLastFetched: existed?.socialProfileLastFetched,
            } as SequenceInfluencerEntity;
        });
        const entities = await SequenceInfluencerRepository.getRepository().save(toInsert);
        return entities;
    }
    @UseLogger()
    @CompanyIdRequired()
    async getAll(sequenceId: string, request: GetSequenceInfluencerRequest) {
        const influencers = await SequenceInfluencerRepository.getRepository().getAllBySequenceId(sequenceId, request);
        return influencers;
    }
}
