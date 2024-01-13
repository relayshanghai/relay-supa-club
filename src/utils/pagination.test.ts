import { describe, it, expect } from 'vitest';
import { getPaginationItems } from 'src/components/boostbot/table/helper';

describe('sucessGetPages', () => {
    it('number of pages from boostbot is less than UI links', () => {
        const result = getPaginationItems(1, 5, 7);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });
    it('handle 1 ellipsis in the middle', () => {
        const result = getPaginationItems(1, 10, 7);
        expect(result).toEqual([1, 2, 3, NaN, 8, 9, 10]);
    });
    it('handle 2 ellipses', () => {
        const result = getPaginationItems(5, 10, 7);
        expect(result).toEqual([1, NaN, 4, 5, 6, NaN, 10]);
    });
    it('ellipsis is not in the middle ellipsis near the end page', () => {
        const result = getPaginationItems(4, 10, 7);
        expect(result).toEqual([1, 2, 3, 4, 5, NaN, 10]);
    });
    it('ellipsis is not in the middle but near the start page', () => {
        const result = getPaginationItems(7, 10, 7);
        expect(result).toEqual([1, NaN, 6, 7, 8, 9, 10]);
    });
    it('handles a large list of pages with 11 links', () => {
        const result = getPaginationItems(5, 100, 11);
        expect(result).toEqual([1, 2, 3, 4, 5, 6, NaN, 97, 98, 99, 100]);
    });
    it('handles a large list of pages with 11 links and 2 ellipses', () => {
        const result = getPaginationItems(50, 100, 11);
        expect(result).toEqual([1, NaN, 47, 48, 49, 50, 51, 52, 53, NaN, 100]);
    });
    it('handles a shorter list with more max links than pages', () => {
        const result = getPaginationItems(1, 5, 11);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });
});
