import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateRequest } from '../validator';
import { getCookieFunction, setCookieFunction } from '../cookie';
import { getBodyParameter } from './api-body-decorator';
import { getQueryParameter } from './api-query-decorator';
import { getCookieParameter, getCookieParserParameter } from './api-cookie-decorator';
import { getPathParametersMeta } from './api-path-decorator';
import { getHeaderParameter } from './api-header-decorator';
import { getIpAddressParameter } from './api-request-ip-decorator';

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
        const headerParameter = getHeaderParameter(target, propertyKey);
        if (headerParameter) {
            const header = req.headers;
            if (headerParameter.key) {
                args[headerParameter.parameterIndex] = header[headerParameter.key];
            } else args[headerParameter.parameterIndex] = header;
        }
        const ipAddressParameter = getIpAddressParameter(target, propertyKey);
        if (ipAddressParameter !== undefined) {
            args[ipAddressParameter] = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        }

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
