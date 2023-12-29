const camelCaseToSnakeCase = (value: string) => value.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());

export const transformKeys = <T = any>(obj: any) => {
    return Object.entries(obj).reduce<{ [k: string]: unknown }>((o, [key, value]) => {
        o[camelCaseToSnakeCase(key)] = value;
        return o;
    }, {}) as T;
};
