import { type SequenceInfo } from 'types/v2/rate-info';

export function calculateSequenceInfo(info: SequenceInfo) {
    const bouncedRate = (info.bounced / info.sent || 0) * 100;
    const openRate = (info.open / info.sent || 0) * 100;
    const replyRate = (info.replied / info.open || 0) * 100;
    return {
        bouncedRate,
        openRate,
        replyRate,
    };
}
