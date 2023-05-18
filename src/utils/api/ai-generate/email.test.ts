import { describe, expect, test } from 'vitest';
import { emailErrors } from '../../../errors/ai-email-generate';
import { hasCustomError } from '../../errors';
import { generateEmailPrompt, MAX_CHARACTER_LENGTH } from './email';

describe('generatePrompt', () => {
    test('returns error message when required fields are missing', () => {
        const data = {
            brandName: '',
            company_id: '',
            influencerName: '',
            productDescription: '',
            productName: '',
            senderName: '',
            user_id: '',
        };

        try {
            generateEmailPrompt(data);
        } catch (error: any) {
            if (hasCustomError(error, emailErrors)) expect(error.message).toBe(emailErrors.missingRequiredFields);
        }
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

        try {
            generateEmailPrompt(data);
        } catch (error: any) {
            if (hasCustomError(error, emailErrors)) expect(error.message).toBe(emailErrors.wrongCharacterLength);
        }
    });

    test('returns prompt when all required fields are provided', () => {
        const data = {
            brandName: 'Apple',
            company_id: '21412',
            influencerName: 'Pete Davidson',
            productName: 'iPhone 12',
            productDescription:
                "Everything you love about iPhone is now even better. With a bigger, more beautiful Super Retina XDR display. A Ceramic Shield front cover that's tougher than any smartphone glass. And an A14 Bionic chip that crushes the competition. iPhone 12. It's a leap year.",
            senderName: 'Steve Jobs',
            user_id: '51613',
        };

        const result = generateEmailPrompt(data);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('returns proper prompt message when all fields are provided', () => {
        const data = {
            brandName: 'Apple',
            company_id: '21412',
            influencerName: 'Pete Davidson',
            productName: 'iPhone 12',
            productDescription:
                "Everything you love about iPhone is now even better. With a bigger, more beautiful Super Retina XDR display. A Ceramic Shield front cover that's tougher than any smartphone glass. And an A14 Bionic chip that crushes the competition. iPhone 12. It's a leap year.",
            senderName: 'Steve Jobs',
            user_id: '51613',
            instructions:
                'Post about the product on your social media. Make sure to tag us in the post and use the hashtag #AppleiPhone12 and #Apple and the deadline is 12/12/2020',
        };

        const result = generateEmailPrompt(data);
        expect(result).toBe(
            "Write an email (without subject) to Pete Davidson with the following content:\n\t1) Express our brand Apple's interest in participating with them on a product marketing campaign.\n\t2) Express that I love their content and appreciate their creativity.\n\t3) Introduce our product: Apple iPhone 12. Everything you love about iPhone is now even better. With a bigger, more beautiful Super Retina XDR display. A Ceramic Shield front cover that's tougher than any smartphone glass. And an A14 Bionic chip that crushes the competition. iPhone 12. It's a leap year.\n\t4) Ask them to follow these instructions: Post about the product on your social media. Make sure to tag us in the post and use the hashtag #AppleiPhone12 and #Apple and the deadline is 12/12/2020.\n\t5) Express my gratitude for Pete Davidson's time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration.\n\t6) Sign with the name: Steve Jobs",
        );
    });

    test('returns proper prompt message when all fields are provided without instructions', () => {
        const data = {
            brandName: 'Apple',
            company_id: '21412',
            influencerName: 'Pete Davidson',
            productName: 'iPhone 12',
            productDescription:
                "Everything you love about iPhone is now even better. With a bigger, more beautiful Super Retina XDR display. A Ceramic Shield front cover that's tougher than any smartphone glass. And an A14 Bionic chip that crushes the competition. iPhone 12. It's a leap year.",
            senderName: 'Steve Jobs',
            user_id: '51613',
        };

        const result = generateEmailPrompt(data);
        expect(result).toBe(
            "Write an email (without subject) to Pete Davidson with the following content:\n\t1) Express our brand Apple's interest in participating with them on a product marketing campaign.\n\t2) Express that I love their content and appreciate their creativity.\n\t3) Introduce our product: Apple iPhone 12. Everything you love about iPhone is now even better. With a bigger, more beautiful Super Retina XDR display. A Ceramic Shield front cover that's tougher than any smartphone glass. And an A14 Bionic chip that crushes the competition. iPhone 12. It's a leap year.\n\t4) Ask them to post about the product on their social media.\n\t5) Express my gratitude for Pete Davidson's time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration.\n\t6) Sign with the name: Steve Jobs",
        );
    });
});
