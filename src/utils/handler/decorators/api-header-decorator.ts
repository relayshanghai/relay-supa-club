import type { ParameterType } from './api-parameter-type';

const headerMetadataKey = Symbol('header');
export const Header =
    (key: string): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(
            headerMetadataKey,
            {
                parameterIndex,
                key,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getHeaderParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(headerMetadataKey, target, propertyKey);
};
