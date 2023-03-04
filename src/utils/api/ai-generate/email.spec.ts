import { describe } from 'node:test';
import { generatePrompt, MAX_CHARACTER_LENGTH } from './email';

describe('generatePrompt', () => {
    test('returns error message when required fields are missing', () => {
        const result = generatePrompt({
            brandName: '',
            company_id: '',
            influencerName: '',
            productDescription: '',
            productName: '',
            senderName: '',
            user_id: '',
        });
        expect(result.status).toBe('error');
        expect(result.message).toBe('Missing required fields!');
    });

    test('returns error message when wrong character length is provided', () => {
        const data = {
            brandName: 'BrandName',
            company_id: 'company_id',
            influencerName: 'InfluencerName',
            productDescription: 'ProductDescription',
            productName: 'ProductName',
            senderName: 'SenderName',
            user_id: 'user_id',
            instructions: 'a'.repeat(MAX_CHARACTER_LENGTH + 1), // provide string greater than the MAX_CHARACTER_LENGTH
        };
        const result = generatePrompt(data);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Wrong character length provided');
    });

    test('returns prompt when all required fields are provided', () => {
        const data = {
            brandName: 'BrandName',
            company_id: 'company_id',
            influencerName: 'InfluencerName',
            productDescription: 'ProductDescription',
            productName: 'ProductName',
            senderName: 'SenderName',
            user_id: 'user_id',
        };
        const result = generatePrompt(data);
        expect(result.status).toBe('success');
        expect(result.message).toBeDefined();
    });

    test('returns proper prompt message when all fields are provided', () => {
        const data = {
            brandName: 'BrandName',
            company_id: 'company_id',
            influencerName: 'InfluencerName',
            productDescription: 'ProductDescription',
            productName: 'ProductName',
            senderName: 'SenderName',
            user_id: 'user_id',
            instructions: 'Follow these instructions.',
        };
        const result = generatePrompt(data);
        expect(result.status).toBe('success');
        expect(result.message).toBe(
            "Write an email (without subject) to InfluencerName with the following content:\n\t1) Express our brand BrandName's interest in participating with them on a product marketing campaign.\n\t2) Express that I love their content and appreciate their creativity.\n\t3) Introduce our product: BrandName ProductName. ProductDescription.\n\t4) Ask them to follow these instructions: Follow these instructions.\n\t5) Express my gratitude for InfluencerName's time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration.\n\t6) Sign with the name: SenderName",
        );
    });

    test('returns proper prompt message when all fields are provided without instructions', () => {
        const data = {
            brandName: 'BrandName',
            company_id: 'company_id',
            influencerName: 'InfluencerName',
            productDescription: 'ProductDescription.',
            productName: 'ProductName',
            senderName: 'SenderName',
            user_id: 'user_id',
        };
        const result = generatePrompt(data);
        expect(result.status).toBe('success');
        expect(result.message).toBe(
            "Write an email (without subject) to InfluencerName with the following content:\n\t1) Express our brand BrandName's interest in participating with them on a product marketing campaign.\n\t2) Express that I love their content and appreciate their creativity.\n\t3) Introduce our product: BrandName ProductName. ProductDescription.\n\t4) Ask them to post about the product on their social media.\n\t5) Express my gratitude for InfluencerName's time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration.\n\t6) Sign with the name: SenderName",
        );
    });
});
