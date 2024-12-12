import CompanyJoinRequestRepository from 'src/backend/database/company-join-request/company-join-request-repository';
import { ForbiddenError } from 'src/utils/error/http-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import { IsNull } from 'typeorm';

export default class JoinRequestService {
    public static readonly service: JoinRequestService = new JoinRequestService();
    static getService(): JoinRequestService {
        return JoinRequestService.service;
    }

    async getJoinRequestCompany() {
        const companyId = RequestContext.getContext().companyId as string;
        const requests = await CompanyJoinRequestRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
                joinedAt: IsNull(),
                ignoredAt: IsNull(),
            },
            relations: {
                profile: true,
            },
        });
        return requests;
    }

    async joinRequestAction(id: string, action: 'accept' | 'ignore') {
        const companyId = RequestContext.getContext().companyId as string;
        const request = await CompanyJoinRequestRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
                id,
                joinedAt: IsNull(),
                ignoredAt: IsNull(),
            },
        });
        if (!request) {
            throw new Error('Request not found');
        }
        if (action === 'accept') {
            request.joinedAt = new Date();
        } else {
            request.ignoredAt = new Date();
        }
        await CompanyJoinRequestRepository.getRepository().save(request);
        return request;
    }

    async checkByEmail(email: string) {
        const request = await CompanyJoinRequestRepository.getRepository().findOne({
            where: {
                profile: {
                    email,
                },
            },
        });
        if (!request?.joinedAt) {
            throw new ForbiddenError('Request not found');
        }
        return request;
    }
}
