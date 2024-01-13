import useSWR from 'swr';

import { useDB } from 'src/utils/client-db/use-client-db';
import {
    getTemplateVariablesBySequenceIdCall,
    insertTemplateVariableCall,
    updateTemplateVariableCall,
} from 'src/utils/api/db/calls/template-variables';
import type { TemplateVariableInsert, TemplateVariableUpdate } from 'src/utils/api/db';
import { useCallback } from 'react';

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
        ([id]) => getTemplateVariablesBySequenceId(id),
    );

    const updateTemplateVariableDBCall = useDB<typeof updateTemplateVariableCall>(updateTemplateVariableCall);
    const updateTemplateVariable = useCallback(
        async (update: TemplateVariableUpdate) => {
            await updateTemplateVariableDBCall(update);
            refreshTemplateVariables();
        },
        [updateTemplateVariableDBCall, refreshTemplateVariables],
    );

    const insertTemplateVariableDBCall = useDB<typeof insertTemplateVariableCall>(insertTemplateVariableCall);
    const insertTemplateVariable = useCallback(
        async (insert: TemplateVariableInsert[]) => {
            await insertTemplateVariableDBCall(insert);
            refreshTemplateVariables();
        },
        [insertTemplateVariableDBCall, refreshTemplateVariables],
    );

    const createDefaultTemplateVariables = useCallback(
        async (sequenceId: string) => {
            const insert: TemplateVariableInsert[] = Object.entries(defaultTemplateVariables).map(([key, value]) => ({
                sequence_id: sequenceId,
                name: key, // note that we aren't really using this yet. Name will be used when users can make their own variables.
                key,
                value,
            }));
            await insertTemplateVariableDBCall(insert);
        },
        [insertTemplateVariableDBCall],
    );

    return {
        templateVariables,
        refreshTemplateVariables,
        updateTemplateVariable,
        insertTemplateVariable,
        createDefaultTemplateVariables,
    };
};
