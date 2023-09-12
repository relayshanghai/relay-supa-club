import type { SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import SequenceRow from './sequence-row';
import { useTranslation } from 'react-i18next';
import { sequenceColumns } from './constants';
import type { SetStateAction } from 'react';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencerManagerPage[];
    sequenceEmails?: SequenceEmail[];
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencerManagerPage['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    handleStartSequence: (sequenceInfluencers: SequenceInfluencerManagerPage[]) => Promise<SequenceSendPostResponse>;
}

const sortInfluencers = (
    currentTab: SequenceInfluencerManagerPage['funnel_status'],
    influencers?: SequenceInfluencerManagerPage[],
    sequenceEmails?: SequenceEmail[],
) => {
    return influencers?.sort((a, b) => {
        const getEmailTime = (influencerId: string) =>
            sequenceEmails?.find((email) => email.sequence_influencer_id === influencerId)?.email_send_at;

        if (currentTab === 'To Contact') {
            return a.created_at.localeCompare(b.created_at);
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
    sequenceEmails,
    sequenceSteps,
    currentTab,
    missingVariables,
    isMissingVariables,
    setShowUpdateTemplateVariables,
    templateVariables,
    handleStartSequence,
}) => {
    const sortedInfluencers = sortInfluencers(currentTab, sequenceInfluencers, sequenceEmails);
    const { t } = useTranslation();

    const columns = sequenceColumns(currentTab);
    return (
        <div className="max-w-full overflow-visible">
            <table className="w-full border-collapse border border-gray-300">
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
                        const influencerEmails = sequenceEmails?.filter(
                            (email) => email.sequence_influencer_id === influencer.id,
                        );
                        const lastStep = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                        const nextStep = sequenceSteps.find(
                            (step) => step.step_number === influencer.sequence_step + 1,
                        );
                        const lastEmail = influencerEmails?.find((email) => email.sequence_step_id === lastStep?.id);
                        const nextEmail = influencerEmails?.find((email) => email.sequence_step_id === nextStep?.id);

                        return (
                            <SequenceRow
                                key={influencer.id}
                                sequenceInfluencer={influencer}
                                lastEmail={lastEmail}
                                nextEmail={nextEmail}
                                lastStep={lastStep}
                                nextStep={nextStep}
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
