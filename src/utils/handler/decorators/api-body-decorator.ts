import type { ParameterType } from './api-parameter-type';

const bodyMetadataKey = Symbol('body');
export const Body =
    (classParam?: new () => any): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        const parameterTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey as string);
        const classMetadata: new () => any = parameterTypes[parameterIndex].prototype.constructor;
        Reflect.defineMetadata(
            bodyMetadataKey,
            {
                parameterIndex,
                classType: classParam ? classParam : classMetadata,
            } as ParameterType,
            target,
            propertyKey as symbol,
        );
    };

export const getBodyParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(bodyMetadataKey, target, propertyKey);
};
