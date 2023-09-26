import useSWR from 'swr';

import { useDB } from 'src/utils/client-db/use-client-db';
import {
    getTemplateVariablesBySequenceIdCall,
    insertTemplateVariableCall,
    updateTemplateVariableCall,
} from 'src/utils/api/db/calls/template-variables';
import type { TemplateVariableInsert, TemplateVariableUpdate } from 'src/utils/api/db';

export const defaultTemplateVariables = {
    brandName: '',
    marketingManagerName: '',
    productName: '',
    productDescription: '',
    productLink: '',
    productPrice: '',
    // influencerNiche: '',
};
export type DefaultTemplateVariableKey = keyof typeof defaultTemplateVariables;

export const useTemplateVariables = (sequenceId?: string) => {
    const getTemplateVariablesBySequenceId = useDB<typeof getTemplateVariablesBySequenceIdCall>(
        getTemplateVariablesBySequenceIdCall,
    );
    const { data: templateVariables, mutate: refreshTemplateVariables } = useSWR(
        sequenceId ? [sequenceId, 'template_variables'] : null,
        ([sequenceId]) => getTemplateVariablesBySequenceId(sequenceId),
    );

    const updateTemplateVariableDBCall = useDB<typeof updateTemplateVariableCall>(updateTemplateVariableCall);
    const updateTemplateVariable = async (update: TemplateVariableUpdate) => {
        await updateTemplateVariableDBCall(update);
        refreshTemplateVariables();
    };

    const insertTemplateVariableDBCall = useDB<typeof insertTemplateVariableCall>(insertTemplateVariableCall);
    const insertTemplateVariable = async (insert: TemplateVariableInsert[]) => {
        await insertTemplateVariableDBCall(insert);
        refreshTemplateVariables();
    };

    const createDefaultTemplateVariables = async (sequenceId: string) => {
        const insert: TemplateVariableInsert[] = Object.entries(defaultTemplateVariables).map(([key, value]) => ({
            sequence_id: sequenceId,
            name: key, // note that we aren't really using this yet. Name will be used when users can make their own variables.
            key,
            value,
        }));
        await insertTemplateVariableDBCall(insert);
    };
    return {
        templateVariables,
        refreshTemplateVariables,
        updateTemplateVariable,
        insertTemplateVariable,
        createDefaultTemplateVariables,
    };
};
