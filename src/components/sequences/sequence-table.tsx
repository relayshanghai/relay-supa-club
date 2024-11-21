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
import type {
    SequenceInfluencerManagerPage,
    SequenceInfluencerManagerPageWithChannelData,
} from 'pages/api/sequence/influencers';
import { DataTablePagination as Pagination } from './pagination';
import type { KeyedMutator } from 'swr';
import { InfluencerDetailsModal } from '../boostbot/modal-influencer-details';
import type { SearchTableInfluencer } from 'types';
import { filterByPage, sortInfluencers, totalNumberOfPages } from 'src/utils/filter-sort/influencer';

interface SequenceTableProps {
    sequence?: Sequence;
    sequenceInfluencers: SequenceInfluencerManagerPageWithChannelData[];
    updateSequenceInfluencer: (i: SequenceInfluencerUpdate) => Promise<SequenceInfluencerManagerPageWithChannelData>;
    refreshSequenceInfluencers: KeyedMutator<SequenceInfluencerManagerPageWithChannelData[]>;
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
    handleStartSequence: (
        sequenceInfluencers: SequenceInfluencerManagerPageWithChannelData[],
    ) => Promise<SequenceSendPostResponse>;
    setCurrentPage: (page: number) => void;
}

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
    setCurrentPage: setCurrentPageProp,
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
            setCurrentPageProp(page);
        },
        [resetCheckAllAndSelection, setCurrentPageProp],
    );

    useEffect(() => {
        setCurrentPageProp(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

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
                filterByPage(currentPage, numberOfInfluencersPerPage, sequenceInfluencers).map(
                    (influencer) => influencer.id,
                ),
            );
        },
        [checkAll, sequenceInfluencers, setSelection],
    );

    const columns = sequenceColumns(currentTab);
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const [currentInfluencer, setCurrentInfluencer] = useState<SearchTableInfluencer>();
    return (
        <div>
            {currentInfluencer && (
                <InfluencerDetailsModal
                    selectedRow={
                        {
                            original: currentInfluencer,
                            index: 0,
                        } as any
                    }
                    isOpen={isInfluencerDetailsModalOpen}
                    setIsOpen={setIsInfluencerDetailsModalOpen}
                    setShowSequenceSelector={() => false}
                    outReachDisabled={false}
                    url="search"
                />
            )}
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
                                handleReportIconTab={() => {
                                    setCurrentInfluencer(influencer.channel_data);
                                    setIsInfluencerDetailsModalOpen(true);
                                }}
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
