import TablePagination from "app/components/table-pagination/table-pagination";
import { useTranslation } from "react-i18next";
import { type SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import SequenceInfluencerTableName from "./sequence-influencer-table-name";
import { getCurrentSequenceStepInfo } from "app/utils/sequences";
import { SendPlane } from "src/components/icons/SendPlane";
import UserBang from "src/components/icons/UserBang";
import RewindTime from "src/components/icons/RewindTime";
import { RingingBell } from "src/components/icons";

export interface SequenceInfluencerTableScheduledProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
}
export const stepIcon = [
    <SendPlane key={0}/>,
    <UserBang key={1}/>,
    <RewindTime key={2}/>,
    <RingingBell key={3}/>
]
export default function SequenceInfluencerTableScheduled({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
    sequenceId
}: SequenceInfluencerTableScheduledProps) {
    const { t } = useTranslation();

    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.name`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.viewCard`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.currentSequenceEmail`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.currentStatus`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.nextSequenceEmail`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.scheduled.nextSequenceEmailSendTime`)}</th>
            </tr>
        </thead>
        <tbody>
            {
                items.map((influencer) => {
                    const { currentStep, nextStep } = getCurrentSequenceStepInfo(influencer)
                return <tr key={influencer.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    
                    <td className="px-6 py-4">
                        <SequenceInfluencerTableName influencer={influencer} />
                    </td>
                    <td className="px-6 py-4">
                    </td>
                    <td className="px-6 py-4">
                        {
                            currentStep && 
                            <div className="h-[60px] px-4 py-2 justify-start items-center gap-2 inline-flex">
                                <div className="w-5 h-5 relative" >
                                    {stepIcon[currentStep?.sequenceStep?.stepNumber]}
                                </div>
                                <div className="text-gray-500 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t(`sequences.steps.${currentStep?.sequenceStep.name}`)}</div>
                            </div>
                        }
                    </td>
                    <td className="px-6 py-4">
                        {
                            currentStep?.emailTrackingStatus || currentStep?.emailDeliveryStatus
                        }
                    </td>
                    <td className="px-6 py-4">
                        
                        {
                            nextStep && 
                            <div className="h-[60px] px-4 py-2 justify-start items-center gap-2 inline-flex">
                                <div className="w-5 h-5 relative" >
                                    {stepIcon[nextStep?.sequenceStep?.stepNumber]}
                                </div>
                                <div className="text-gray-500 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t(`sequences.steps.${nextStep?.sequenceStep.name}`)}</div>
                            </div>
                        }

                    </td>
                    <td className="px-6 py-4">
                        {
                            nextStep && nextStep?.emailSendAt?.toString()
                        }
                    </td>
                </tr>
                })
            }
        
            </tbody>
        </table>
        <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange}/>
    </div>
}