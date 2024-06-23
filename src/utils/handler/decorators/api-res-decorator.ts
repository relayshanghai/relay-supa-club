import type { ParameterType } from './api-parameter-type';

const response = Symbol('response');
export const Res = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
        response,
        {
            parameterIndex,
        } as ParameterType,
        target,
        propertyKey as symbol,
    );
};

export const getResponse = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(response, target, propertyKey);
};
