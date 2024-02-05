import type { ApiError } from 'src/errors/api-error';
import { z } from 'zod';

export const query = z.object({
    id: z.string(),
    filename: z.string(),
});

export const DownloadAttachmentApiRequest = z.object({
    query: query.required(),
});

export type DownloadAttachmentApiRequest = z.infer<typeof DownloadAttachmentApiRequest>;

export type DownloadAttachmentApiResponse = Buffer | string | ApiError;
