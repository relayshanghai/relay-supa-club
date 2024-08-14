import { type SequenceInfo } from "types/v2/rate-info";

export function calculateSequenceInfo(info: SequenceInfo) {
    const bouncedRate = info.sent ? (info.bounced / info.sent ) * 100 : 0;
    const openRate = info.sent ? (info.open / info.sent ) * 100 : 0;
    const replyRate = info.sent ? (info.replied / (info.sent) ) * 100 : 0;
    return {
        bouncedRate,
        openRate,
        replyRate
    }
}