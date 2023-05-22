import type { CreatorReport } from 'types';

export function isCreatorReport(o: any): o is CreatorReport {
    return (o as CreatorReport).user_profile !== undefined;
}
