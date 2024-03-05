import type { ParameterType } from './api-parameter-type';

const cookieMetadataKey = Symbol('cookie');
export const Cookie =
    (key?: string): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(
            cookieMetadataKey,
            {
                parameterIndex,
                key,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getCookieParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(cookieMetadataKey, target, propertyKey);
};

const cookieParserMetadataKey = Symbol('cookie-parser');
export const CookieParser = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(cookieParserMetadataKey, parameterIndex, target, propertyKey as symbol);
};

export const getCookieParserParameter = (target: any, propertyKey: string | symbol): number => {
    return Reflect.getMetadata(cookieParserMetadataKey, target, propertyKey);
};
