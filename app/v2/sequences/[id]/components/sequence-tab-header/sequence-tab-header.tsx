import { useEffect, useState } from "react";
import SequenceTabHeaderItem from "./sequence-tab-header-item";
import { useTranslation } from "react-i18next";

export interface SequenceTabHeaderProps {
    tabChanged: (active: string) => void;
    scheduledAndSent: number;
    replied: number;
    ignored: number;
    unscheduled: number;
}
export default function SequenceTabHeader({
    tabChanged,
    ignored,
    replied,
    scheduledAndSent,
    unscheduled
}: SequenceTabHeaderProps){
    const { t } = useTranslation();
    const [tabActive, setTabActive] = useState('unscheduled'); 
    useEffect(() => {
        tabChanged(tabActive);
    }, [tabActive])
    return (
        <div className="justify-start items-end gap-2.5 flex">
            <SequenceTabHeaderItem 
                badgeClassName="bg-orange-100 text-orange-500"
                badge={unscheduled && unscheduled.toString() || undefined}
                title={t('sequences.unscheduled')} 
                active={tabActive === 'unscheduled'} 
                onClick={() => setTabActive('unscheduled')} />
            <SequenceTabHeaderItem 
                badgeClassName="bg-violet-100 text-violet-500"
                badge={scheduledAndSent && scheduledAndSent.toString() || undefined}
                title={t('sequences.scheduledAndSent')} 
                active={tabActive === 'scheduledAndSent'} 
                onClick={() => setTabActive('scheduledAndSent')} />
            <SequenceTabHeaderItem 
                badgeClassName="bg-green-100 text-green-500"
                badge={replied && replied.toString() || undefined}
                title={t('sequences.replied')} 
                active={tabActive === 'replied'} 
                onClick={() => setTabActive('replied')} />
            <SequenceTabHeaderItem 
                badgeClassName="bg-grey-100 text-grey-500"
                badge={ignored && ignored.toString() || undefined}
                title={t('sequences.ignored')} 
                active={tabActive === 'ignored'} 
                onClick={() => setTabActive('ignored')} />
        </div>
    )
}