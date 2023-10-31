import type { SequenceEmailStep } from 'types/appTypes';

export interface TemplatesTemplateGetResponse {
    account: null;
    id: string;
    name: SequenceEmailStep;
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
