import type { ThreadEntity } from "src/backend/database/thread/thread-entity";
import type { Paginated } from "types/pagination";
import type { ThreadStatusRequest } from "./request";

export type ThreadMessageCountResponse = Record<ThreadStatusRequest, number>;

export interface GetThreadResponse extends Paginated<ThreadEntity>{
    messageCount: ThreadMessageCountResponse;
}