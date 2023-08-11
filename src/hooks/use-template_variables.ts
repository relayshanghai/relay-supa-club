import useSWR from 'swr';

import { useDB } from 'src/utils/client-db/use-client-db';
import {
    getTemplateVariablesBySequenceIdCall,
    insertTemplateVariableCall,
    updateTemplateVariableCall,
} from 'src/utils/api/db/calls/template-variables';
import type { TemplateVariableInsert, TemplateVariableUpdate } from 'src/utils/api/db';

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
    const insertTemplateVariable = async (insert: TemplateVariableInsert) => {
        await insertTemplateVariableDBCall(insert);
        refreshTemplateVariables();
    };
    return {
        templateVariables,
        refreshTemplateVariables,
        updateTemplateVariable,
        insertTemplateVariable,
    };
};
