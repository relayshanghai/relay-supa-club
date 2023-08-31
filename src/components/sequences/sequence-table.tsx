import type { SequenceInfluencer, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import SequenceRow from './sequence-row';
import { useTranslation } from 'react-i18next';
import { sequenceColumns } from './constants';
import type { SetStateAction } from 'react';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencer[];
    sequenceEmails?: SequenceEmail[];
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencer['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    handleStartSequence: (sequenceInfluencers: SequenceInfluencer[]) => Promise<SequenceSendPostResponse>;
    selectedAll: boolean;
    handleCheckAll: (checkedAll: boolean) => void;
    handleCheckboxChange: (id: string) => void;
}

const sortInfluencers = (
    currentTab: SequenceInfluencer['funnel_status'],
    influencers?: SequenceInfluencer[],
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
    selectedAll,
    handleCheckAll,
    handleCheckboxChange,
}) => {
    const sortedInfluencers = sortInfluencers(currentTab, sequenceInfluencers, sequenceEmails);
    const { t } = useTranslation();
    //@ts-ignore
    const dummyEmails: SequenceEmail[] = [
        {
            id: '43bc002f-cfa2-415f-a0e5-ba2d6f897809',
            created_at: '2023-08-31T07:49:09.438408+00:00',
            updated_at: '2023-09-01T07:49:09.438408+00:00',
            email_send_at: '2023-08-27T07:49:11.00454+00:00',
            email_message_id: '<512fdb72-2467-b3ab-b213-4604b252c10f@boostbot.ai>',
            email_delivery_status: 'Delivered',
            email_tracking_status: null,
            sequence_influencer_id: '5fd65701-4e3c-49f2-bf00-f23455d18bac',
            sequence_step_id: 'e180472d-9b4e-4b28-8235-bf0eaa3206e4',
            sequence_id: '1e03d18e-a7db-44f7-8748-8b86d35fd9fd',
        },
        {
            id: '51c8eb35-fcf8-4c48-a0c5-dbe9aad961e3',
            created_at: '2023-08-31T07:49:11.00454+00:00',
            updated_at: '2023-08-31T07:49:11.00454+00:00',
            email_send_at: '2023-08-28T07:49:11.00454+00:00',
            email_message_id: '<2ebc5e8e-e586-e03a-1e9b-2646ef05aa27@boostbot.ai>',
            email_delivery_status: 'Delivered',
            email_tracking_status: null,
            sequence_influencer_id: '5fd65701-4e3c-49f2-bf00-f23455d18bac',
            sequence_step_id: 'ba5734c0-4f5d-487b-823e-6614098f6184',
            sequence_id: '1e03d18e-a7db-44f7-8748-8b86d35fd9fd',
        },
        {
            id: '237445ca-6879-4302-872f-f0793ecf71fd',
            created_at: '2023-08-29T07:49:04.733527+00:00',
            updated_at: '2023-08-31T07:49:08.246+00:00',
            email_send_at: '2023-09-01T07:49:11.00454+00:00',
            email_message_id: '<8a7a0132-63b9-476d-3e0b-e04cf68a1efc@boostbot.ai>',
            email_delivery_status: 'Delivered',
            email_tracking_status: null,
            sequence_influencer_id: '5fd65701-4e3c-49f2-bf00-f23455d18bac',
            sequence_step_id: '1bb9d844-7c10-467c-8e70-d122f0a567ed',
            sequence_id: '1e03d18e-a7db-44f7-8748-8b86d35fd9fd',
        },
        {
            id: 'a927106f-4cd3-45ca-a53e-34ef5f78de98',
            created_at: '2023-08-31T07:49:07.783736+00:00',
            updated_at: '2023-08-31T07:49:07.783736+00:00',
            email_send_at: '2023-08-31T07:49:11.00454+00:00',
            email_message_id: '<ec851848-d140-5eb3-74c4-9b0f117bf9dc@boostbot.ai>',
            email_delivery_status: 'Delivered',
            email_tracking_status: 'Opened',
            sequence_influencer_id: '5fd65701-4e3c-49f2-bf00-f23455d18bac',
            sequence_step_id: '14be0359-d830-416d-9e0f-78b4ab627896',
            sequence_id: '1e03d18e-a7db-44f7-8748-8b86d35fd9fd',
        },
    ];

    const columns = sequenceColumns(currentTab);
    return (
        <div className="max-w-full border-collapse overflow-auto rounded-md border border-gray-300">
            <table className="w-full ">
                <thead>
                    <tr>
                        {currentTab === 'To Contact' && (
                            <th className="bg-white">
                                <input
                                    className="display-none checkbox appearance-none rounded checked:text-primary-500"
                                    type="checkbox"
                                    checked={selectedAll}
                                    onChange={(e) => {
                                        handleCheckAll(e.target.checked);
                                    }}
                                />
                            </th>
                        )}
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
                        const influencerEmails = dummyEmails;
                        const lastStep = sequenceSteps.find(
                            (step) => step.step_number === influencer.sequence_step - 1,
                        );
                        const nextStep = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
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
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SequenceTable;
