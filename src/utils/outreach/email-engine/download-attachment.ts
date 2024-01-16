import { apiFetch } from './api-fetch';

type DownloadAttachmentPathQueries = {
    account: string;
    attachmentId: string;
};

type DownloadAttachmentFn = (account: string, attachmentId: string) => Promise<Buffer>;

export const downloadAttachment: DownloadAttachmentFn = async (account, attachmentId) => {
    const response = await apiFetch<string, { path: DownloadAttachmentPathQueries }>(
        `/account/{account}/attachment/{attachmentId}`,
        { path: { account, attachmentId } },
    );

    const buffer = Buffer.from(await response.response.arrayBuffer());

    return buffer;
};
