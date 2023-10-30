import type { InfluencerStepTypes } from 'types/appTypes';

export interface TemplatesTemplateGetResponse {
    account: null;
    id: string;
    name: InfluencerStepTypes;
    description: string;
    format: string;
    created: string;
    updated: string;
    content: Content;
}

export interface Content {
    subject: string;
    html: string;
    text: string;
    previewText: string;
}
