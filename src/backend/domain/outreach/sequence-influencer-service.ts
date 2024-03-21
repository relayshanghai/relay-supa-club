import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import { AddressRepository } from 'src/backend/database/influencer/address-repository';
import { NotFoundError } from 'src/utils/error/http-error';
import type { UpdateAddressRequest } from 'pages/api/v2/sequence-influencers/[id]/addresses/request';
import type { UpdateSequenceInfluencerRequest } from 'pages/api/v2/sequence-influencers/[id]/request';

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
}
