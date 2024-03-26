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

export const getPathParametersMeta = (
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
