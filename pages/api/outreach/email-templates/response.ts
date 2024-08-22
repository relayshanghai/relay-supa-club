import type { CompanyEntity } from 'src/backend/database/company/company-entity';
import { type SequenceStepEntity } from 'src/backend/database/sequence/sequence-step-entity';

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
    emailEngineTemplateId?: string;
    sequenceStep?: SequenceStepEntity;
    company?: CompanyEntity;
}

export interface GetAllTemplateResponse {
    id: string;
    name: string;
    description?: string;
    step: string;
}
