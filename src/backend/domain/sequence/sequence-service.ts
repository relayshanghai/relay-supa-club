import type { SequenceRequest } from 'pages/api/outreach/sequences/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import ProductRepository from 'src/backend/database/product/product-repository';
import awaitToError from 'src/utils/await-to-error';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { NotFoundError } from 'src/utils/error/http-error';

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
        const [err, product] = await awaitToError(
            ProductRepository.getRepository().findOne({ where: { id: request.productId } }),
        );
        if (err) {
            throw new NotFoundError('Product not found');
        }
        const response = await SequenceRepository.getRepository().save({
            ...request,
            company: { id: companyId },
            product: { id: product?.id },
            manager: { id: user?.id },
            managerFirstName: profile?.firstName,
        });
        return response;
    }
}
