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
        expect(result.message).toBe('Wrong character length provided');
    });

    test('returns prompt when all required fields are present', () => {
        const result = generateSubjectPrompt({
            brandName: 'brand name',
            company_id: 'company id',
            productDescription: 'a'.repeat(MAX_CHARACTER_LENGTH),
            productName: 'product name',
            user_id: 'user id',
        });
        expect(result.status).toBe('success');
        expect(result.message).toBe(
            'Generate a short email subject line, regarding a marketing campaign collaboration for our product product name. Here is a description of the product: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. It should start with a catchy and attention grabbing headline and after that mention that this is a marketing campaign collaboration invitation.',
        );
    });
});
