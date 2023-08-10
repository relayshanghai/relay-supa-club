import useSWR from 'swr';

import { useDB } from 'src/utils/client-db/use-client-db';
import {
    getTemplateVariablesBySequenceIdCall,
    updateTemplateVariableCall,
} from 'src/utils/api/db/calls/template-variables';
import type { TemplateVariableUpdate } from 'src/utils/api/db';

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

    return {
        templateVariables,
        refreshTemplateVariables,
        updateTemplateVariable,
    };
};
