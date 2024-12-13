import { CompanyJoinRequestRepository } from 'src/backend/database/company-join-request/company-join-request-repository';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import { CompanyIdRequired } from '../decorators/company-id';
import { In, IsNull, Not } from 'typeorm';

export class TeammateService {
    static service = new TeammateService();
    static getService = () => TeammateService.service;
    @CompanyIdRequired()
    async getTeammates() {
        const companyId = RequestContext.getContext().companyId as string;
        const pendingRequests = await CompanyJoinRequestRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
                joinedAt: IsNull(),
            },
            relations: {
                profile: true,
            },
        });
        const joinProfileids = pendingRequests.map((joinRequest) => joinRequest.profile?.id);
        const profiles = await ProfileRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
                id: Not(In(joinProfileids)),
            },
        });
        return profiles;
    }
}
