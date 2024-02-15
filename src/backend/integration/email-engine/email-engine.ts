import axios from 'axios';
export const EMAIL_ENGINE_API_URL = process.env.EMAIL_ENGINE_API_URL
    ? process.env.EMAIL_ENGINE_API_URL + '/v1'
    : 'http://localhost:4000/v1';

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;

if (!EMAIL_ENGINE_API_KEY) {
    throw new Error('EMAIL_ENGINE_API_KEY is not defined');
}

export type EmailTemplate = {
    name: string;
    subject: string;
    html: string;
};

export default class EmailEngineService {
    static service: EmailEngineService = new EmailEngineService();
    static getService(): EmailEngineService {
        return EmailEngineService.service;
    }

    apiClient = axios.create({
        baseURL: EMAIL_ENGINE_API_URL,
        params: {
            access_token: EMAIL_ENGINE_API_KEY,
        },
    });

    /**
     *
     * @param template
     * @returns inserted id from email engine
     */
    async createTemplate(template: EmailTemplate): Promise<string> {
        const response = await this.apiClient.post('/templates/template', {
            account: null,
            name: template.name,
            description: '',
            format: 'html',
            content: {
                subject: template.subject,
                text: '',
                html: template.html,
                previewText: '',
            },
        });
        return response.data.id;
    }
    async updateTemplate(id: string, template: EmailTemplate): Promise<void> {
        await this.apiClient.put(`/templates/template/${id}`, {
            name: template.name,
            description: '',
            format: 'html',
            content: {
                subject: template.subject,
                text: '',
                html: template.html,
                previewText: '',
            },
        });
    }
}
