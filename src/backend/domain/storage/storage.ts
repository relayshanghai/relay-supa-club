import SupabaseStorageService from 'src/backend/integration/supabase-storage';
import { RequestContext } from 'src/utils/request-context/request-context';
import * as path from 'path';
export default class StorageService {
    static service: StorageService = new StorageService();
    static getService(): StorageService {
        return StorageService.service;
    }
    async createUploadSignUrl(filepath: string): Promise<string> {
        const companyId = RequestContext.getContext().companyId as string;
        const url = await SupabaseStorageService.getService().createUploadSignUrl(path.join(companyId, filepath));
        return url;
    }
    async createDownloadSignUrl(filepath: string): Promise<string> {
        const companyId = RequestContext.getContext().companyId as string;
        // if companyId is undefined, it means that the request is from the public site
        if (companyId) {
            const filepaths = filepath.split('/');
            if (filepaths[0] !== companyId) {
                filepath = path.join(companyId, filepath);
            }
        }
        const url = await SupabaseStorageService.getService().createDownloadSignUrl(filepath);
        return url;
    }
    async fileList(directory: string): Promise<string[]> {
        const companyId = RequestContext.getContext().companyId as string;
        const fileList = await SupabaseStorageService.getService().fileList(path.join(companyId, directory));
        return fileList;
    }
    async remove(filepath: string): Promise<void> {
        const companyId = RequestContext.getContext().companyId as string;
        await SupabaseStorageService.getService().remove(path.join(companyId, filepath));
    }
}
