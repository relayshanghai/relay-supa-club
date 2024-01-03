import type { threads } from 'drizzle/schema';
import { z } from 'zod';
import { THREAD_STATUS } from '../outreach/constants';

export const updatableData = z.object({
    thread_status: THREAD_STATUS.optional(),
});

export type UpdatableData = z.infer<typeof updatableData>;

const query = z.object({
    id: z.string(),
});

export const UpdateThreadApiRequest = z.object({
    query: query.required(),
    body: updatableData.required(),
});

export type UpdateThreadApiRequest = z.infer<typeof UpdateThreadApiRequest>;

export type UpdateThreadApiResponse = { data: typeof threads.$inferSelect };
