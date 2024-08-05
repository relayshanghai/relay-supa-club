import type { ParameterType } from './api-parameter-type';

const request = Symbol('request');
export const Req = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
        request,
        {
            parameterIndex,
        } as ParameterType,
        target,
        propertyKey as symbol,
    );
};

export const getRequest = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(request, target, propertyKey);
};
