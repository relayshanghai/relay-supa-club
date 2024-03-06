import type { ParameterType } from './api-parameter-type';

const query = Symbol('query');
export const Query =
    (classType: new () => any): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(
            query,
            {
                parameterIndex,
                classType,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getQueryParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(query, target, propertyKey);
};
