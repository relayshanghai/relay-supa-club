import type { NextApiRequest } from 'next';

export interface AuthFunction {
    (req: NextApiRequest): Promise<void>;
}

export const AuthMetadataKey = Symbol('auth');
export interface AuthMetadataValue {
    auth: AuthFunction;
    propertyKey: string;
}

export const getAuthMetadata = (target: any, propertyKey: string | symbol): AuthMetadataValue => {
    return Reflect.getMetadata(AuthMetadataKey, target, propertyKey);
};

/**
 * this decorator should be called before method decorators @POST, @GET, @PUT, @DELETE
 * @param fn
 * @returns
 */
export const Auth =
    (fn: AuthFunction): MethodDecorator =>
    (target, propertyKey) => {
        Reflect.defineMetadata(
            AuthMetadataKey,
            {
                auth: fn,
                propertyKey,
            } as AuthMetadataValue,
            target,
            propertyKey,
        );
    };
