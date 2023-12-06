import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { describe, it, expect } from 'vitest';
import { findMostRecentMessageFromOtherPerson } from './correspondence-section';

describe('findMostRecentMessageFromOtherPerson', () => {
    it('should return the most recent message from the other person', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from'>[] = [
            {
                id: '1',
                date: '2021-01-01',
                from: {
                    address: 'me',
                    name: 'me',
                },
            },
            {
                id: '4',
                // most recent from other person
                date: '2021-01-04',
                from: {
                    address: 'other',
                    name: 'other',
                },
            },
            {
                id: '3',
                date: '2021-01-03',
                from: {
                    address: 'me',
                    name: 'me',
                },
            },
            {
                id: '2',
                date: '2021-01-02',
                from: {
                    address: 'other',
                    name: 'other',
                },
            },
        ];
        const result = findMostRecentMessageFromOtherPerson(messages as SearchResponseMessage[], 'me');
        expect(result?.id).toEqual('4');
    });
    it('should return undefined if there are no messages', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from'>[] = [];
        const result = findMostRecentMessageFromOtherPerson(messages as SearchResponseMessage[], 'me');
        expect(result).toEqual(undefined);
    });
    it('should return undefined if there are no messages from the other person', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from'>[] = [
            {
                id: '1',
                date: '2021-01-01',
                from: {
                    address: 'me',
                    name: 'me',
                },
            },
            {
                id: '3',
                date: '2021-01-03',
                from: {
                    address: 'me',
                    name: 'me',
                },
            },
        ];
        const result = findMostRecentMessageFromOtherPerson(messages as SearchResponseMessage[], 'me');
        expect(result).toEqual(undefined);
    });
});
