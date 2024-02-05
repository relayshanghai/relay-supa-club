import { RequestContext } from 'src/utils/request-context/request-context';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { StorageClient } from '@supabase/storage-js';

describe('src/backend/domain/storage/storage.ts', () => {
    describe('StorageService', () => {
        const supabaseStorageCreateSignedUploadUrlMock = vi.fn();
        const supabaseStorageCreateSignedUrlMock = vi.fn();
        const supabaseStorageRemoveMock = vi.fn();
        const supabaseStoragelistMock = vi.fn();

        beforeEach(() => {
            vi.resetAllMocks();
            const getContextMock = vi.fn();
            RequestContext.getContext = getContextMock;
            getContextMock.mockReturnValue({
                companyId: 'company_1',
                requestUrl: 'https://example.com',
            });
            StorageClient.prototype.from = vi.fn().mockReturnValue({
                createSignedUploadUrl: supabaseStorageCreateSignedUploadUrlMock,
                createSignedUrl: supabaseStorageCreateSignedUrlMock,
                list: supabaseStoragelistMock,
                remove: supabaseStorageRemoveMock,
            });
        });
        describe('createUploadSignUrl', () => {
            it('should return signed url', async () => {
                supabaseStorageCreateSignedUploadUrlMock.mockResolvedValue({
                    data: {
                        signedUrl: 'signed_url',
                    },
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                const result = await StorageService.getService().createUploadSignUrl('file_1');
                expect(result).toEqual('signed_url');
                expect(supabaseStorageCreateSignedUploadUrlMock).toHaveBeenCalledWith('company_1/file_1');
            });
            it('should throw error if error', async () => {
                supabaseStorageCreateSignedUploadUrlMock.mockResolvedValue({
                    error: {
                        message: 'error_message',
                    },
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                await expect(StorageService.getService().createUploadSignUrl('file_1')).rejects.toThrow(
                    'error_message',
                );
            });
        });
        describe('createDownloadSignUrl', () => {
            it('should return signed url', async () => {
                supabaseStorageCreateSignedUrlMock.mockResolvedValue({
                    data: {
                        signedUrl: 'signed_url',
                    },
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                const result = await StorageService.getService().createDownloadSignUrl('file_1');
                expect(result).toEqual('signed_url');
                expect(supabaseStorageCreateSignedUrlMock).toHaveBeenCalledWith('company_1/file_1', 60);
            });
            it('should throw error if error', async () => {
                supabaseStorageCreateSignedUrlMock.mockResolvedValue({
                    error: {
                        message: 'error_message',
                    },
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                await expect(StorageService.getService().createDownloadSignUrl('file_1')).rejects.toThrow(
                    'error_message',
                );
            });
        });
        describe('fileList', () => {
            it('should return file list', async () => {
                supabaseStoragelistMock.mockResolvedValue({
                    data: [{ name: 'file_1' }, { name: 'file_2' }],
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                const result = await StorageService.getService().fileList('directory_1');
                expect(result).toEqual(['file_1', 'file_2']);
                expect(supabaseStoragelistMock).toHaveBeenCalledWith('company_1/directory_1');
            });
            it('should throw error if error', async () => {
                supabaseStoragelistMock.mockResolvedValue({
                    error: {
                        message: 'error_message',
                    },
                });
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                await expect(StorageService.getService().fileList('directory_1')).rejects.toThrow('error_message');
            });
        });
        describe('remove', () => {
            it('should call remove', async () => {
                const StorageService = (await import('src/backend/domain/storage/storage')).default;
                supabaseStorageRemoveMock.mockResolvedValue({});
                await StorageService.getService().remove('file_1');
                expect(supabaseStorageRemoveMock).toHaveBeenCalledWith(['company_1/file_1']);
            });
        });
    });
});
