import { useState } from 'react';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { AttachmentFile } from 'src/utils/outreach/types';

export const useStorage = (directory: string) => {
    const [uploading, setUploadingStatus] = useState(false);
    const upload = async (file: AttachmentFile[]) => {
        setUploadingStatus(true);
        await Promise.all(
            file.map(async (file) => {
                const { content } = await apiFetch<{ url: string }>(
                    `/api/files/upload-presign-url?filename=${directory}/${file.filename}`,
                );
                const data = new FormData();

                data.append('file', file.content);
                await apiFetch(content.url, undefined, {
                    method: 'PUT',
                    body: data,
                });
            }),
        ).finally(() => setUploadingStatus(false));
    };
    const remove = async (filename: string) => {
        await apiFetch(`/api/files/${directory}/${filename}`, undefined, {
            method: 'DELETE',
        });
    };
    return {
        upload,
        uploading,
        remove,
    };
};

export default useStorage;
