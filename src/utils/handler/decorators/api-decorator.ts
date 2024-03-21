import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateRequest } from '../validator';
import { getCookieFunction, setCookieFunction } from '../cookie';
const bodyMetadataKey = Symbol('body');
interface ParameterType {
    parameterIndex: number;
    classType: new () => any;
    key?: string;
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

const getCookieParameter = (target: any, propertyKey: string | symbol): ParameterType => {
    return Reflect.getMetadata(cookieMetadataKey, target, propertyKey);
};

const cookieParserMetadataKey = Symbol('cookie-parser');
export const CookieParser = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(cookieParserMetadataKey, parameterIndex, target, propertyKey as symbol);
};

const getCookieParserParameter = (target: any, propertyKey: string | symbol): number => {
    return Reflect.getMetadata(cookieParserMetadataKey, target, propertyKey);
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
    descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
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
        const cookieParameter = getCookieParameter(target, propertyKey);
        if (cookieParameter) {
            let cookie: any;
            if (cookieParameter.key) {
                cookie = req.cookies[cookieParameter.key];
            } else {
                cookie = req.cookies;
            }
            args[cookieParameter.parameterIndex] = cookie;
        }
        const cookieParserParameter = getCookieParserParameter(target, propertyKey);
        if (cookieParserParameter !== undefined) {
            args[cookieParserParameter] = {
                set: setCookieFunction(req, res),
                get: getCookieFunction(req),
            };
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
export const PATCH = () => HandleDecorator('PATCH');
export const DELETE = () => HandleDecorator('DELETE');

export const getHandlerMetadata = (target: any, method: string) => {
    return Reflect.getMetadata(method, target);
};

export const Status =
    (code: number): MethodDecorator =>
    (target, propertyKey) => {
        Reflect.defineMetadata('statusCode', code, target, propertyKey);
    };

export const getStatusCode = (target: any, propertyKey: string | symbol): number => {
    return Reflect.getMetadata('statusCode', target, propertyKey);
};
