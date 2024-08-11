import { Compass, RingingBell, ClockAnticlockwise } from 'app/components/icons';
import { OutreachStatus } from 'app/v2/sequences/types';

export const OutreachTabIcon = ({ status }: { status: OutreachStatus }) => {
    switch (status) {
        case 'OUTREACH':
            return <Compass className="h-4 w-4 stroke-2" />;
        case 'FIRST_FOLLOW_UP':
            return <RingingBell className="h-4 w-4" />;
        case 'SECOND_FOLLOW_UP':
            return <ClockAnticlockwise className="h-4 w-4" />;
        case 'THIRD_FOLLOW_UP':
            return <ClockAnticlockwise className="h-4 w-4" />;
        default:
            return <ClockAnticlockwise className="h-4 w-4" />;
    }
};
