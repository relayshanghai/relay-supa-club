import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { describe, it, expect } from 'vitest';
import { findMostRecentMessageFromOtherPerson, findOtherPeopleInThread } from './helpers';

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

describe('findOtherPeopleInThread', () => {
    it('should return the other people in the threads email addresses', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from'>[] = [
            {
                id: '1',
                date: '2021-01-01',
                from: {
                    address: 'me@example.com',
                    name: 'me',
                },
            },
            {
                id: '4',
                // most recent from other person
                date: '2021-01-04',
                from: {
                    address: 'other@example.com',
                    name: 'other',
                },
            },
            {
                id: '3',
                date: '2021-01-03',
                from: {
                    address: 'me@example.com',
                    name: 'me',
                },
            },
            {
                id: '2',
                date: '2021-01-02',
                from: {
                    address: 'other@example.com',
                    name: 'other',
                },
            },
        ];
        const result = findOtherPeopleInThread(messages as SearchResponseMessage[], 'me@example.com');
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual('other@example.com');
    });

    it('should handle multiple other people in the thread', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from'>[] = [
            {
                id: '1',
                date: '2021-01-01',
                from: {
                    address: 'me@example.com',
                    name: 'me',
                },
            },
            {
                id: '4',
                // most recent from other person
                date: '2021-01-04',
                from: {
                    address: 'other1@example.com',
                    name: 'other',
                },
            },
            {
                id: '3',
                date: '2021-01-03',
                from: {
                    address: 'other2@example.com',
                    name: 'me',
                },
            },
        ];
        const result = findOtherPeopleInThread(messages as SearchResponseMessage[], 'me@example.com');
        expect(result).toEqual(['other1@example.com', 'other2@example.com']);
    });
    it('should handle multiple other people in the thread with cc', () => {
        const messages: Pick<SearchResponseMessage, 'id' | 'date' | 'from' | 'cc'>[] = [
            {
                id: '1',
                date: '2021-01-01',
                from: {
                    address: 'me@example.com',
                    name: 'me',
                },
                cc: [],
            },
            {
                id: '4',
                // most recent from other person
                date: '2021-01-04',
                from: {
                    address: 'other1@example.com',
                    name: 'other',
                },
                cc: [],
            },
            {
                id: '3',
                date: '2021-01-03',
                from: {
                    address: 'other2@example.com',
                    name: 'me',
                },
                cc: [],
            },
            {
                id: '2',
                date: '2021-01-02',
                from: {
                    address: 'me@example.com',
                    name: 'me',
                },
                cc: [
                    {
                        address: 'cc1@example.com',
                        name: 'cc1',
                    },
                ],
            },
            {
                id: '5',
                date: '2021-01-02',
                from: {
                    address: 'other1@example.com',
                    name: 'other1',
                },
                cc: [
                    {
                        address: 'cc2@example.com',
                        name: 'cc2',
                    },
                    {
                        address: 'cc3@example.com',
                        name: 'cc3',
                    },
                ],
            },
        ];

        const result = findOtherPeopleInThread(messages as SearchResponseMessage[], 'me@example.com');
        const expected = [
            'other1@example.com',
            'other2@example.com',
            'cc1@example.com',
            'cc2@example.com',
            'cc3@example.com',
        ];
        expect(result).toEqual(expected);
    });
});
