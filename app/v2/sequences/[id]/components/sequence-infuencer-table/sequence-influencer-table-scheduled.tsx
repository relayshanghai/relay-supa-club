import TablePagination from 'app/components/table-pagination/table-pagination';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerTableName from './sequence-influencer-table-name';
import { getCurrentSequenceStepInfo } from 'app/utils/sequences';
import { SendPlane } from 'src/components/icons/SendPlane';
import UserBang from 'src/components/icons/UserBang';
import RewindTime from 'src/components/icons/RewindTime';
import { RingingBell } from 'src/components/icons';

export interface SequenceInfluencerTableScheduledProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
}
export const stepIcon = [<SendPlane key={0} />, <UserBang key={1} />, <RewindTime key={2} />, <RingingBell key={3} />];
export default function SequenceInfluencerTableScheduled({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
}: SequenceInfluencerTableScheduledProps) {
    const { t } = useTranslation();

    return (
        <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.name`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.viewCard`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.currentSequenceEmail`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.currentStatus`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.nextSequenceEmail`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.scheduled.nextSequenceEmailSendTime`)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((influencer) => {
                        const { currentStep, nextStep } = getCurrentSequenceStepInfo(influencer);
                        return (
                            <tr
                                key={influencer.id}
                                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                            >
                                <td className="px-6 py-4">
                                    <SequenceInfluencerTableName influencer={influencer} />
                                </td>
                                <td className="px-6 py-4" />
                                <td className="px-6 py-4">
                                    {currentStep && (
                                        <div className="inline-flex h-[60px] items-center justify-start gap-2 px-4 py-2">
                                            <div className="relative h-5 w-5">
                                                {stepIcon[currentStep?.sequenceStep?.stepNumber]}
                                            </div>
                                            <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-500">
                                                {t(`sequences.steps.${currentStep?.sequenceStep.name}`)}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {currentStep?.emailTrackingStatus || currentStep?.emailDeliveryStatus}
                                </td>
                                <td className="px-6 py-4">
                                    {nextStep && (
                                        <div className="inline-flex h-[60px] items-center justify-start gap-2 px-4 py-2">
                                            <div className="relative h-5 w-5">
                                                {stepIcon[nextStep?.sequenceStep?.stepNumber]}
                                            </div>
                                            <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-500">
                                                {t(`sequences.steps.${nextStep?.sequenceStep.name}`)}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">{nextStep && nextStep?.emailSendAt?.toString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}
