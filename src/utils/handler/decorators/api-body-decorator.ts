import type { ParameterType } from './api-parameter-type';

const bodyMetadataKey = Symbol('body');
export const Body =
    (classType: new () => any): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(
            bodyMetadataKey,
            {
                parameterIndex,
                classType,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getBodyParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(bodyMetadataKey, target, propertyKey);
};
