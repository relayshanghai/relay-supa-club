import type {
    Sequence,
    SequenceEmail,
    SequenceInfluencerUpdate,
    SequenceStep,
    TemplateVariable,
} from 'src/utils/api/db';
import SequenceRow from './sequence-row';
import { useTranslation } from 'react-i18next';
import { sequenceColumns } from './constants';
import { type SetStateAction, useCallback, useState, useEffect } from 'react';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { DataTablePagination as Pagination } from './pagination';
import { isMissingSocialProfileInfo } from './helpers';
import type { KeyedMutator } from 'swr';

interface SequenceTableProps {
    sequence?: Sequence;
    sequenceInfluencers: SequenceInfluencerManagerPage[];
    updateSequenceInfluencer: (i: SequenceInfluencerUpdate) => Promise<SequenceInfluencerManagerPage>;
    refreshSequenceInfluencers: KeyedMutator<SequenceInfluencerManagerPage[]>;
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

const totalNumberOfPages = (sortedInfluencers: any[] | undefined, numberOfInfluencersPerPage: number) => {
    //gets the number of pages
    if (sortedInfluencers?.length) {
        return Math.ceil(sortedInfluencers.length / numberOfInfluencersPerPage);
    }
    return 1;
};

const filterByPage = (
    currentPage: number,
    numberOfInfluencersPerPage: number,
    sortedInfluencers: any[] | undefined,
) => {
    //calculates the range splice   the results
    const lastPage = totalNumberOfPages(sortedInfluencers, numberOfInfluencersPerPage);
    const startRange = (currentPage - 1) * numberOfInfluencersPerPage;
    let endRange: any = currentPage * numberOfInfluencersPerPage;
    const totalNoOfInfluencers: any = sortedInfluencers?.length;

    if (totalNoOfInfluencers > endRange && currentPage == lastPage) {
        endRange = sortedInfluencers?.length;
    }

    if (sortedInfluencers) {
        return sortedInfluencers?.slice(startRange, endRange);
    }
    return [];
};

const SequenceTable: React.FC<SequenceTableProps> = ({
    sequence,
    updateSequenceInfluencer,
    refreshSequenceInfluencers,
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
    const [currentPage, setCurrentPageState] = useState(1);
    const numberOfInfluencersPerPage = 25;

    const [checkAll, setCheckAll] = useState(false);

    const handleCheckboxChange = useCallback(
        (id: string) => {
            if (selection.includes(id)) {
                setSelection(selection.filter((selectedId) => selectedId !== id));
                setCheckAll(false);
                return;
            }
            setSelection([...selection, id]);
        },
        [selection, setSelection],
    );

    const resetCheckAllAndSelection = useCallback(() => {
        setCheckAll(false);
        setSelection([]);
    }, [setSelection]);

    const setCurrentPage = useCallback(
        (page: number) => {
            resetCheckAllAndSelection();
            setCurrentPageState(page);
        },
        [resetCheckAllAndSelection],
    );

    useEffect(() => {
        resetCheckAllAndSelection();
    }, [currentTab, resetCheckAllAndSelection]);

    const handleCheckAll = useCallback(
        (currentPage: number, numberOfInfluencersPerPage: number) => {
            if (checkAll) {
                setSelection([]);
                setCheckAll(false);
                return;
            }
            setCheckAll(true);
            setSelection(
                filterByPage(currentPage, numberOfInfluencersPerPage, sequenceInfluencers)
                    .filter((influencer) => influencer.email && !isMissingSocialProfileInfo(influencer))
                    .map((influencer) => influencer.id),
            );
        },
        [checkAll, sequenceInfluencers, setSelection],
    );

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
                                checked={checkAll}
                                onChange={() => handleCheckAll(currentPage, numberOfInfluencersPerPage)}
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
                    {filterByPage(currentPage, numberOfInfluencersPerPage, sortedInfluencers).map((influencer) => {
                        const influencerEmails = sequenceEmails?.filter(
                            (email) => email.sequence_influencer_id === influencer.id,
                        );
                        const lastStep = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                        const nextStep = sequenceSteps.find(
                            (step) => step.step_number === influencer.sequence_step + 1,
                        );
                        const lastEmail = influencerEmails?.find((email) => email.sequence_step_id === lastStep?.id);
                        return (
                            <SequenceRow
                                key={influencer.id}
                                sequence={sequence}
                                sequenceInfluencer={influencer}
                                sequenceInfluencers={sequenceInfluencers}
                                updateSequenceInfluencer={updateSequenceInfluencer}
                                refreshSequenceInfluencers={refreshSequenceInfluencers}
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
            <Pagination
                setPageIndex={setCurrentPage}
                currentPage={currentPage}
                pages={totalNumberOfPages(sortedInfluencers, numberOfInfluencersPerPage)}
            />
        </div>
    );
};

export default SequenceTable;
