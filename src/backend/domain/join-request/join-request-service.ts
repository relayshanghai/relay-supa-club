import { CompanyJoinRequestRepository } from 'src/backend/database/company-join-request/company-join-request-repository';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import awaitToError from 'src/utils/await-to-error';
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
            relations: {
                profile: true,
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
        await awaitToError(
            Promise.all([
                // change user role to company_teammate
                ProfileRepository.getRepository().update(
                    { email: request.profile?.email },
                    { userRole: 'company_teammate' },
                ),
                CompanyJoinRequestRepository.getRepository().save(request),
            ]),
        );
        return request;
    }

    async checkByEmail(email: string) {
        const request = await ProfileRepository.getRepository().findOne({
            where: {
                email,
            },
            relations: {
                companyJoinRequests: true,
                company: true,
            },
        });
        if (!request?.companyJoinRequests?.joinedAt && request?.company?.profiles?.[0].userRole !== 'company_owner') {
            throw new ForbiddenError('Request not found');
        }
        return request;
    }
}
