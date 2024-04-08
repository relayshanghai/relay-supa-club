import { useEffect, useState } from 'react';
import type {
    OutreachEmailTemplateEntity,
    Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import useSWR from 'swr';
import { type Nullable } from 'types/nullable';
import { create } from 'zustand';

type SequenceEmailTemplateHook = { step?: Step };

interface SequenceStore {
    sequenceEmailTemplate: Nullable<OutreachEmailTemplateEntity>;
    setSequenceEmailTemplate: (sequenceEmailTemplate: Nullable<OutreachEmailTemplateEntity>) => void;
    resetSequenceEmailTemplate: () => void;
}

const useSequenceEmailTemplateStore = create<SequenceStore>((set) => ({
    sequenceEmailTemplate: null,
    setSequenceEmailTemplate: (sequenceEmailTemplate: Nullable<OutreachEmailTemplateEntity>) =>
        set({ sequenceEmailTemplate: sequenceEmailTemplate }),
    resetSequenceEmailTemplate: () => set({ sequenceEmailTemplate: null }),
}));

export interface SequenceEmailWithStep extends OutreachEmailTemplateEntity {
    step: Step;
}
interface StagedSequenceEmailStore {
    stagedSequenceEmailTemplates: SequenceEmailWithStep[];
    setStagedSequenceEmailTemplate: (sequenceEmailTemplates: SequenceEmailWithStep[]) => void;
    resetStagedSequenceEmailTemplate: () => void;
}

export const useStagedSequenceEmailTemplateStore = create<StagedSequenceEmailStore>((set) => ({
    stagedSequenceEmailTemplates: [],
    setStagedSequenceEmailTemplate: (sequenceEmailTemplates: SequenceEmailWithStep[]) =>
        set({ stagedSequenceEmailTemplates: sequenceEmailTemplates }),
    resetStagedSequenceEmailTemplate: () => set({ stagedSequenceEmailTemplates: [] }),
}));

export const useSequenceEmailTemplates = ({ step }: SequenceEmailTemplateHook) => {
    const { loading, error, apiClient } = useApiClient();
    const [activeStep, setActiveStep] = useState<Nullable<Step>>();
    const { sequenceEmailTemplate, setSequenceEmailTemplate } = useSequenceEmailTemplateStore();

    useEffect(() => {
        setActiveStep(step);
    }, [step]);

    const { data: sequenceEmailTemplates, mutate: refreshSequenceEmailTemplates } = useSWR(
        ['/outreach/email-templates', step],
        async () => {
            const [err, res] = await awaitToError(
                apiClient
                    .get<OutreachEmailTemplateEntity[]>(`/outreach/email-templates?step=${step}`)
                    .then((res) => res.data),
            );
            if (err) throw err;
            return res;
        },
    );

    const getSequenceEmailTemplate = async (id?: string) => {
        const seqId = id ?? sequenceEmailTemplate?.id;
        const [err, sequenceEmail] = await awaitToError(
            apiClient.get<OutreachEmailTemplateEntity>(`/outreach/email-templates/${seqId}`).then((res) => res.data),
        );
        if (err) throw err;
        return sequenceEmail;
    };

    return {
        sequenceEmailTemplate,
        sequenceEmailTemplates,
        refreshSequenceEmailTemplates,
        setSequenceEmailTemplate,
        getSequenceEmailTemplate,
        setActiveStep,
        activeStep,
        loading,
        error,
    };
};
