import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateRequest } from '../validator';
const bodyMetadataKey = Symbol('body');
interface ParameterType {
    parameterIndex: number;
    classType: new () => any;
}
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

const getBodyParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(bodyMetadataKey, target, propertyKey);
};

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

const getQueryParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(query, target, propertyKey);
};

const path = Symbol('path');
export const Path =
    (pathParameterName: string): ParameterDecorator =>
    (target, propertyKey, parameterIndex) => {
        const pathMeta = getPathParametersMeta(target, propertyKey as symbol);
        pathMeta.push({
            parameterIndex,
            pathParameter: pathParameterName,
        });
        Reflect.defineMetadata(path, pathMeta, target, propertyKey as symbol);
    };

const getPathParametersMeta = (
    target: any,
    propertyKey: string | symbol,
): [
    {
        parameterIndex: number;
        pathParameter: string;
    },
] => {
    return Reflect.getMetadata(path, target, propertyKey) || [];
};

const getClassValue = async (targetClass: new () => any, request: any) => {
    const data = plainToInstance(targetClass, request);
    await validateRequest(data);
    return data;
};

const handleApiDescriptor: MethodDecorator = (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req: NextApiRequest, _res: NextApiResponse) {
        const args: any[] = [];
        const bodyParameter = getBodyParameter(target, propertyKey);
        if (bodyParameter) {
            const data = await getClassValue(bodyParameter.classType, req.body);
            args[bodyParameter.parameterIndex] = data;
        }
        const queryParameter = getQueryParameter(target, propertyKey);
        if (queryParameter) {
            const data = await getClassValue(queryParameter.classType, req.query);
            args[queryParameter.parameterIndex] = data;
        }
        getPathParametersMeta(target, propertyKey).forEach((params) => {
            args[params.parameterIndex] = req.query[params.pathParameter];
        });
        const response = await originalMethod.apply(this, args);
        return response;
    };
};

export const HandleDecorator =
    (method: string): MethodDecorator =>
    (target, propertyKey, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(method, propertyKey, target);
        handleApiDescriptor(target, propertyKey, descriptor);
    };

export const POST = () => HandleDecorator('POST');
export const GET = () => HandleDecorator('GET');
export const PUT = () => HandleDecorator('PUT');
export const DELETE = () => HandleDecorator('DELETE');

export const getHandlerMetadata = (target: any, method: string) => {
    return Reflect.getMetadata(method, target);
};
