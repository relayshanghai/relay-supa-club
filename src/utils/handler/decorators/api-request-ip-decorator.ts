const ipMetadataKey = Symbol('ipAddress');
export const IpAddress = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(ipMetadataKey, parameterIndex, target, propertyKey as symbol);
};

export const getIpAddressParameter = (target: any, propertyKey: string | symbol): number => {
    return Reflect.getMetadata(ipMetadataKey, target, propertyKey);
};
