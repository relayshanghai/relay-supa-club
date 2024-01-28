import { StorageClient } from '@supabase/storage-js';

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || '';
const DOWNLOAD_URL_EXPIRY = 60; // 1 minute
export default class SupabaseStorageService {
    static service: SupabaseStorageService = new SupabaseStorageService();
    static getService(): SupabaseStorageService {
        return SupabaseStorageService.service;
    }
    private storageClient: StorageClient;
    constructor() {
        this.storageClient = new StorageClient(STORAGE_URL, {
            apiKey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
        });
    }
    async createUploadSignUrl(filepath: string): Promise<string> {
        const signedUrl = await this.storageClient.from(BUCKET_NAME).createSignedUploadUrl(filepath);
        if (signedUrl.error) {
            throw new Error(signedUrl.error.message);
        }
        return signedUrl.data?.signedUrl;
    }
    async createDownloadSignUrl(filepath: string): Promise<string> {
        const signedUrl = await this.storageClient.from(BUCKET_NAME).createSignedUrl(filepath, DOWNLOAD_URL_EXPIRY);
        if (signedUrl.error) {
            throw new Error(signedUrl.error.message);
        }
        return signedUrl.data?.signedUrl;
    }
    async fileList(directory: string): Promise<string[]> {
        const { data, error } = await this.storageClient.from(BUCKET_NAME).list(directory);
        if (error) {
            throw new Error(error.message);
        }
        return data?.map((file) => file.name) || [];
    }
    async remove(filepath: string): Promise<void> {
        const { error } = await this.storageClient.from(BUCKET_NAME).remove([filepath]);
        if (error) {
            throw new Error(error.message);
        }
    }
}
