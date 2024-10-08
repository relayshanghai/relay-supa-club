import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import type { Paginated } from 'types/pagination';
import type { SequenceInfo } from 'types/v2/rate-info';

export interface GetAllSequenceResponse extends Paginated<SequenceEntity> {
    info: SequenceInfo;
}
