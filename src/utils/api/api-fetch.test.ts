import { describe, it, expect } from 'vitest';

describe('Test API fetch', () => {
    it('Test error', async () => {
        await expect(fetch('https://non-existent-domain')).rejects.toThrow('fetch failed');
    });
});
