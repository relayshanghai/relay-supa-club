import { describe } from 'node:test';
import { generateSubjectPrompt, MAX_CHARACTER_LENGTH } from './subject';

describe('generatePrompt', () => {
    test('returns error message when required fields are missing', () => {
        const result = generateSubjectPrompt({
            brandName: '',
            company_id: '',
            productDescription: '',
            productName: '',
            user_id: '',
        });
        expect(result.status).toBe('error');
        expect(result.message).toBe('Missing required fields!');
    });

    test('returns error message when prompt is too long', () => {
        const result = generateSubjectPrompt({
            brandName: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
            company_id: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
            productDescription: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
            productName: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
            user_id: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
        });
        expect(result.status).toBe('error');
        expect(result.message).toBe('Prompt is too long!');
    });

    test('returns prompt when all required fields are present', () => {
        const result = generateSubjectPrompt({
            brandName: 'a'.repeat(MAX_CHARACTER_LENGTH),
            company_id: 'a'.repeat(MAX_CHARACTER_LENGTH),
            productDescription: 'a'.repeat(MAX_CHARACTER_LENGTH),
            productName: 'a'.repeat(MAX_CHARACTER_LENGTH),
            user_id: 'a'.repeat(MAX_CHARACTER_LENGTH),
        });
        expect(result.status).toBe('success');
    });
});
