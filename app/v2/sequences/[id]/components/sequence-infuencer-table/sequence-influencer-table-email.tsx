import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import { TableInlineInput } from "src/components/library";
import { useSequenceInfluencerEmail } from "src/hooks/v2/use-sequence-influencer";
import { useSequenceInfluencerStore } from "src/store/reducers/sequence-influencer";

export interface SequenceInfluencerTableEmailProps {
    index: number;
    influencer: SequenceInfluencerEntity;
    sequenceId: string;
}

export default function SequenceInfluencerTableEmail({
    index,
    influencer,
    sequenceId,
}: SequenceInfluencerTableEmailProps) {
    const { t } = useTranslation();
    const [value, setValue] = useState(influencer.email || '');
    const {
        setSequenceInfluencerByIndex
    } = useSequenceInfluencerStore();
    const {
        updateEmail
    } = useSequenceInfluencerEmail(sequenceId, influencer.id)
    const onSubmit = async (val: string) => {
        setValue(val);
        const result = await updateEmail(val);
        if (result) {
            setSequenceInfluencerByIndex(index, {
                ...influencer,
                email: val
            });
        }
    }

    return <TableInlineInput
        onSubmit={onSubmit}
        value={value}
        textPromptForMissingValue={t('sequences.addEmail')}
    />
} 