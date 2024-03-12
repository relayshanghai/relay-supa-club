import { UnauthorizedError } from 'src/utils/error/http-error';
import { RequestContext } from 'src/utils/request-context/request-context';

export const CompanyIdRequired = (): MethodDecorator => (_target, _property, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const companyId = RequestContext.getContext().companyId;
        if (!companyId) {
            throw new UnauthorizedError('No company id found in request context');
        }
        return originalMethod.apply(this, args);
    };
};
