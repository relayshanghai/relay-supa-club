import type { ParameterType } from './api-parameter-type';

const query = Symbol('query');
export const Query =
    (classParam?: new () => any): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        const parameterTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey as string);
        const classMetadata: new () => any = parameterTypes[parameterIndex].prototype.constructor;
        Reflect.defineMetadata(
            query,
            {
                parameterIndex,
                classType: classParam ? classParam : classMetadata,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getQueryParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(query, target, propertyKey);
};
