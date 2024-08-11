import { type TemplateRequest } from 'pages/api/outreach/email-templates/request';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useEmailTemplateStore } from 'src/store/reducers/email-template';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export type CreateTemplatePayload = {
    name: string;
    category: string;
};

export const useOutreachTemplate = () => {
    const { item: emailTemplate, list: emailTemplates, setEmailTemplates, setEmailTemplate } = useEmailTemplateStore();
    const { apiClient, loading, error } = useApiClient();
    const getTemplates = async () => {
        const [err, res] = await awaitToError(
            apiClient.get<OutreachEmailTemplateEntity[]>(`/outreach/email-templates`).then((res) => res.data),
        );
        if (err) return;
        setEmailTemplates(res);
        return res;
    };
    const createTemplate = async (payload: TemplateRequest) => {
        const [err, res] = await awaitToError(
            apiClient.post<OutreachEmailTemplateEntity>('/outreach/email-templates', payload),
        );
        if (err) throw err;
        return res.data;
    };
    const updateTemplate = async (id: string, payload: TemplateRequest) => {
        const [err, res] = await awaitToError(apiClient.put(`/outreach/email-templates/${id}`, payload));
        if (err) throw err;
        return res.data;
    };
    const getTemplate = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.get(`/outreach/email-templates/${id}`));
        if (err) throw err;
        return res.data;
    };
    return {
        loading,
        error,
        emailTemplate,
        getTemplates,
        createTemplate,
        updateTemplate,
        getTemplate,
        setEmailTemplate,
        emailTemplates,
    };
};
