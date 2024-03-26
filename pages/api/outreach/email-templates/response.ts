export interface GetTemplateVariableResponse {
    id: string;
    name: string;
    category: string;
}
export interface GetTemplateResponse {
    id: string;
    name: string;
    description?: string;
    step: string;
    subject: string;
    template: string;
    variables: GetTemplateVariableResponse[];
}

export interface GetAllTemplateResponse {
    id: string;
    name: string;
    description?: string;
    step: string;
}
