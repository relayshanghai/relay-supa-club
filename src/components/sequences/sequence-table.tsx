import type { SequenceInfluencer, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import SequenceRow from './sequence-row';
import { useTranslation } from 'react-i18next';
import { sequenceColumns } from './constants';
import type { SetStateAction } from 'react';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencer[];
    allSequenceEmails?: SequenceEmail[];
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencer['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    handleStartSequence: (sequenceInfluencers: SequenceInfluencer[]) => Promise<SequenceSendPostResponse>;
}

const sortInfluencers = (
    currentTab: SequenceInfluencer['funnel_status'],
    influencers?: SequenceInfluencer[],
    allSequenceEmails?: SequenceEmail[],
) => {
    return influencers?.sort((a, b) => {
        const getEmailTime = (influencerId: string) =>
            allSequenceEmails?.find((email) => email.sequence_influencer_id === influencerId)?.email_send_at;

        if (currentTab === 'To Contact') {
            return b.created_at.localeCompare(a.created_at);
        } else if (currentTab === 'In Sequence' || currentTab === 'Ignored') {
            const mailTimeA = getEmailTime(a.id);
            const mailTimeB = getEmailTime(b.id);

            if (!mailTimeA || !mailTimeB) {
                return -1;
            }

            return mailTimeB.localeCompare(mailTimeA);
        }

        return 0;
    });
};

const SequenceTable: React.FC<SequenceTableProps> = ({
    sequenceInfluencers,
    allSequenceEmails,
    sequenceSteps,
    currentTab,
    missingVariables,
    isMissingVariables,
    setShowUpdateTemplateVariables,
    templateVariables,
    handleStartSequence,
}) => {
    const sortedInfluencers = sortInfluencers(currentTab, sequenceInfluencers, allSequenceEmails);
    const { t } = useTranslation();

    const columns = sequenceColumns(currentTab);
    return (
        <div className="max-w-full overflow-auto">
            <table className="border-collapse border border-gray-300">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column}
                                className="whitespace-nowrap bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500"
                            >
                                {t(`sequences.columns.${column}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedInfluencers?.map((influencer) => {
                        const step = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                        const sequenceEmail = allSequenceEmails?.find(
                            (email) =>
                                email.sequence_influencer_id === influencer.id && email.sequence_step_id === step?.id,
                        );

                        return (
                            <SequenceRow
                                key={influencer.id}
                                sequenceInfluencer={influencer}
                                sequenceEmail={sequenceEmail}
                                sequenceSteps={sequenceSteps}
                                currentTab={currentTab}
                                isMissingVariables={isMissingVariables}
                                missingVariables={missingVariables}
                                setShowUpdateTemplateVariables={setShowUpdateTemplateVariables}
                                templateVariables={templateVariables}
                                handleStartSequence={handleStartSequence}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SequenceTable;
