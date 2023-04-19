import type { CacheInterface } from '../types';

export class Memory implements CacheInterface<Memory> {
    protected cache: { [key: string]: any } = {};

    async save(key: string, data: any): Promise<boolean | null> {
        this.cache[key] = data;
        return true;
    }

    async get(key: string): Promise<any | null> {
        return key in this.cache ? this.cache[key] : null;
    }

    async remove(key: string): Promise<boolean> {
        delete this.cache[key];
        return true;
    }
}
