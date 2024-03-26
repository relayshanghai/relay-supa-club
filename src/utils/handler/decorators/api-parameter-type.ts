export interface ParameterType {
    parameterIndex: number;
    classType: new () => any;
    key?: string;
}
