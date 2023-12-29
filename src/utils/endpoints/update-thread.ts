import type { threads } from 'drizzle/schema';
import { z } from 'zod';

const body = z.object({
    threadStatus: z.enum(['unopened', 'unreplied', 'replied']).optional(),
});

const query = z.object({
    id: z.string(),
});

export const ApiRequest = z.object({
    query: query.required(),
    body: body.required(),
});

export type ApiRequest = z.infer<typeof ApiRequest>;

export type ApiResponse = { data: typeof threads.$inferSelect };
