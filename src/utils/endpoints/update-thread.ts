import type { threads } from 'drizzle/schema';
import { z } from 'zod';
import { THREAD_STATUS } from '../outreach/constants';

export const updatableData = z.object({
    threadStatus: THREAD_STATUS.optional(),
});

export type UpdatableData = z.infer<typeof updatableData>;

const query = z.object({
    id: z.string(),
});

export const ApiRequest = z.object({
    query: query.required(),
    body: updatableData.required(),
});

export type ApiRequest = z.infer<typeof ApiRequest>;

export type ApiResponse = { data: typeof threads.$inferSelect };
