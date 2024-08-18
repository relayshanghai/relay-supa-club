/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import SequenceTabHeaderItem from './sequence-tab-header-item';
import { useTranslation } from 'react-i18next';

export interface SequenceTabHeaderProps {
    tabChanged: (active: string) => void;
    scheduledAndSent: number;
    replied: number;
    ignored: number;
    unscheduled: number;
    loading?: boolean;
}
export default function SequenceTabHeader({
    tabChanged,
    ignored,
    replied,
    scheduledAndSent,
    unscheduled,
    loading,
}: SequenceTabHeaderProps) {
    const { t } = useTranslation();
    const [tabActive, setTabActive] = useState('unscheduled');
    useEffect(() => {
        tabChanged(tabActive);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabActive]);
    return (
        <div className="flex items-end justify-start gap-2.5">
            <SequenceTabHeaderItem
                loading={loading}
                badgeClassName="bg-orange-100 text-orange-500"
                badge={(unscheduled && unscheduled.toString()) || undefined}
                title={t('sequences.unscheduled')}
                active={tabActive === 'unscheduled'}
                onClick={() => setTabActive('unscheduled')}
            />
            <SequenceTabHeaderItem
                loading={loading}
                badgeClassName="bg-violet-100 text-violet-500"
                badge={(scheduledAndSent && scheduledAndSent.toString()) || undefined}
                title={t('sequences.scheduledAndSent')}
                active={tabActive === 'scheduledAndSent'}
                onClick={() => setTabActive('scheduledAndSent')}
            />
            <SequenceTabHeaderItem
                loading={loading}
                badgeClassName="bg-green-100 text-green-500"
                badge={(replied && replied.toString()) || undefined}
                title={t('sequences.replied')}
                active={tabActive === 'replied'}
                onClick={() => setTabActive('replied')}
            />
            <SequenceTabHeaderItem
                loading={loading}
                badgeClassName="bg-grey-100 text-grey-500"
                badge={(ignored && ignored.toString()) || undefined}
                title={t('sequences.ignored')}
                active={tabActive === 'ignored'}
                onClick={() => setTabActive('ignored')}
            />
        </div>
    );
}
