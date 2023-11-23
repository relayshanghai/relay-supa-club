import type { Sequence, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import SequenceRow from './sequence-row';
import { useTranslation } from 'react-i18next';
import { sequenceColumns } from './constants';
import { type SetStateAction, useCallback, useState } from 'react';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import {DataTablePagination as Pagination} from './pagination';

interface SequenceTableProps {
    sequence?: Sequence;
    sequenceInfluencers: SequenceInfluencerManagerPage[];
    sequenceEmails?: SequenceEmail[];
    loadingEmails: boolean;
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencerManagerPage['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    selection: string[];
    setSelection: (selection: string[]) => void;
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
    sequence,
    sequenceInfluencers,
    sequenceEmails,
    loadingEmails,
    sequenceSteps,
    currentTab,
    missingVariables,
    isMissingVariables,
    setShowUpdateTemplateVariables,
    templateVariables,
    handleStartSequence,
    selection,
    setSelection,
}) => {
    const sortedInfluencers = sortInfluencers(currentTab, sequenceInfluencers, sequenceEmails);
    const { t } = useTranslation();
    const [currentPage,setCurrentPage]=useState(1);
    const totalNumberOfPages= ()=>{
        if (sortedInfluencers?.length){
            console.log(sortInfluencers.length)
            return (sortedInfluencers.length/numberOfInfluencersPerPage); // change to 25 later
        }
        return 1;
    };
    const numberOfInfluencersPerPage=6;
    const getRangePerPage=()=>{}

    const handleCheckboxChange = useCallback(
        function (id: string) {
        if (selection.includes(id)) {
            setSelection(selection.filter((selectedId) => selectedId !== id));
            return;
        }
        setSelection([...selection, id]);
    },
        [selection, setSelection],
    );

    const handleCheckAll = useCallback(() => {
        if (selection.length === sequenceInfluencers.length) {
            setSelection([]);
            return;
        }
        setSelection(sequenceInfluencers.map((influencer) => influencer.id));
    }, [selection, sequenceInfluencers, setSelection]);

    const columns = sequenceColumns(currentTab);
    return (
        <div>
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="border-b-2 border-gray-200">
                    <th className="bg-white px-4">
                        <input
                            data-testid="sequence-influencers-select-all"
                            className="display-none appearance-none rounded border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                            type="checkbox"
                            checked={sequenceInfluencers.length === selection.length && selection.length > 0}
                            onChange={handleCheckAll}
                        />
                    </th>
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
                {sortedInfluencers?.slice((currentPage-1)*numberOfInfluencersPerPage, currentPage*numberOfInfluencersPerPage)?.map((influencer) => {
                    const influencerEmails = sequenceEmails?.filter(
                        (email) => email.sequence_influencer_id === influencer.id,
                    );
                    const lastStep = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                    const nextStep = sequenceSteps.find((step) => step.step_number === influencer.sequence_step + 1);
                    const lastEmail = influencerEmails?.find((email) => email.sequence_step_id === lastStep?.id);
                    return (
                        <SequenceRow
                            key={influencer.id}
                            sequence={sequence}
                            sequenceInfluencer={influencer}
                            loadingEmails={loadingEmails}
                            lastEmail={lastEmail}
                            lastStep={lastStep}
                            nextStep={nextStep}
                            sequenceSteps={sequenceSteps}
                            currentTab={currentTab}
                            isMissingVariables={isMissingVariables}
                            missingVariables={missingVariables}
                            setShowUpdateTemplateVariables={setShowUpdateTemplateVariables}
                            templateVariables={templateVariables}
                            handleStartSequence={handleStartSequence}
                            checked={selection.includes(influencer.id)}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    );
                })}
            </tbody>
        </table>
        <Pagination setPageIndex={setCurrentPage} currentPage={currentPage} pages={totalNumberOfPages()}/>
        </div>
        //   * use state total number of pages,currentpage,if can nextpage, sa setter of the current page  */
        
    );
};

export default SequenceTable;
