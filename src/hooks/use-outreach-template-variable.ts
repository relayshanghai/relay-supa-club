import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { useTemplateVariableStore } from 'src/store/reducers/template-variable';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';
import useSWR from 'swr';

export type CreateTemplateVariablePayload = {
    name: string;
    category: string;
};

export const useOutreachTemplateVariable = () => {
    const {
        item: templateVariable,
        list: templateVariables,
        isEdit,
        setTemplateVariables,
        setTemplateVariable,
        setIsEdit,
    } = useTemplateVariableStore();
    const { apiClient, loading, error } = useApiClient();

    const { mutate: getTemplateVariables } = useSWR(['/outreach/variables'], async () => {
        const [err, res] = await awaitToError(
            apiClient.get<OutreachEmailTemplateVariableEntity[]>(`/outreach/variables`).then((res) => res.data),
        );
        if (err) throw err;
        setTemplateVariables(res);
        return res;
    });
    const createTemplateVariable = async (payload: CreateTemplateVariablePayload) => {
        const [err, res] = await awaitToError(
            apiClient.post<OutreachEmailTemplateVariableEntity>('/outreach/variables', payload),
        );
        if (err) throw err;
        return res.data;
    };
    const updateTemplateVariable = async (id: string, payload: CreateTemplateVariablePayload) => {
        const [err, res] = await awaitToError(apiClient.put(`/outreach/variables/${id}`, payload));
        if (err) throw err;
        return res.data;
    };
    const deleteTemplateVariable = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.delete(`/outreach/variables/${id}`));
        if (err) throw err;
        return res.data;
    };
    return {
        loading,
        error,
        templateVariables,
        getTemplateVariables,
        createTemplateVariable,
        updateTemplateVariable,
        deleteTemplateVariable,
        setTemplateVariable,
        templateVariable,
        isEdit,
        setIsEdit,
    };
};
