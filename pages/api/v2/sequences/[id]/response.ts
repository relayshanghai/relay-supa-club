import { type SequenceEntity } from "src/backend/database/sequence/sequence-entity";
import { type RateInfo } from "types/v2/rate-info";

export interface GetSequenceDetailResponse extends SequenceEntity{
    rateInfo: RateInfo
}