import { describe, it, expect } from 'vitest';
import { gatherMessageIds, generateMessageId, generateReferences } from './thread-helpers';

describe('generateMessageId', () => {
    it('should generate a message id to the format "<UUID@senderdomain.com>" (including the <> symbols)', () => {
        const exampleEmail = 'email@example.com';
        const result = generateMessageId(exampleEmail);
        // contains the <> and @ symbols
        expect(result).toMatch(/<.*@.*>/);
        // contains the email domain
        expect(result).toMatch(exampleEmail.split('@')[1]);
    });
});

describe('gatherMessageIds', () => {
    it('should return an object with the step numbers as keys and message ids as values', () => {
        const exampleEmail = 'email@example.com';
        const sequenceSteps = [{ step_number: 1 }, { step_number: 2 }, { step_number: 3 }];
        const result = gatherMessageIds(exampleEmail, sequenceSteps as any);
        // formats as object with step numbers as keys and message ids as values
        expect(result).toEqual({
            1: expect.stringMatching(/<.*@.*>/),
            2: expect.stringMatching(/<.*@.*>/),
            3: expect.stringMatching(/<.*@.*>/),
        });
        const emails = Object.values(result);
        // contains the <> and @ symbols
        expect(emails).toEqual(expect.arrayContaining([expect.stringMatching(/<.*@.*>/)]));
        // contains the email domain
        expect(emails).toEqual(expect.arrayContaining([expect.stringMatching(exampleEmail.split('@')[1])]));
    });
});

describe('generateReferences', () => {
    it(`should return a string of message ids separated by spaces, with the 0 sequence step being empty, the 1 sequence step using the 0 step's messageId, and the 2 step using "messageId1 messageId2" and so on`, () => {
        const messageIds = {
            0: '<id0@example.com>',
            1: '<id1@example.com>',
            2: '<id2@example.com>',
            3: '<id3@example.com>',
        };
        const result = generateReferences(messageIds, 0);

        expect(result).toBe('');

        const result1 = generateReferences(messageIds, 1);
        expect(result1).toBe(messageIds[0]);

        const result2 = generateReferences(messageIds, 2);
        expect(result2).toBe(`${messageIds[0]} ${messageIds[1]}`);

        const result3 = generateReferences(messageIds, 3);

        expect(result3).toBe(`${messageIds[0]} ${messageIds[1]} ${messageIds[2]}`);
    });
});
