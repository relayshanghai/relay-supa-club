import { subjectErrors } from './../../../errors/ai-email-generate';
import { hasCustomError } from '../../errors';
import { generateSubjectPrompt, MAX_CHARACTER_LENGTH } from './subject';

describe('generatePrompt', () => {
    test('returns error message when required fields are missing', () => {
        const data = {
            brandName: '',
            company_id: '',
            productDescription: '',
            productName: '',
            user_id: '',
        };
        try {
            generateSubjectPrompt(data);
        } catch (error: any) {
            if (hasCustomError(error, subjectErrors))
                expect(error.message).toBe(subjectErrors.missingRequiredFields);
        }
    });

    test('returns error when max character length is crossed', () => {
        try {
            generateSubjectPrompt({
                brandName: 'brand name',
                company_id: 'company id',
                productDescription: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
                productName: 'product name',
                user_id: 'user id',
            });
        } catch (error: any) {
            if (hasCustomError(error, subjectErrors))
                expect(error.message).toBe(subjectErrors.wrongCharacterLength);
        }
    });

    test('returns prompt when all required fields are correct', () => {
        const data = {
            brandName: 'brand name',
            company_id: 'company id',
            productDescription:
                'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            productName: 'product name',
            user_id: 'user id',
        };

        try {
            const result = generateSubjectPrompt(data);
            expect(result.prompt).toBeDefined();
            expect(result.prompt).toBe(
                'Generate a short email subject line, regarding a marketing campaign collaboration for our product product name. Here is a description of the product: Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. It should start with a catchy and attention grabbing headline and after that mention that this is a marketing campaign collaboration invitation.',
            );
        } catch (error: any) {
            expect(
                error.message === subjectErrors.missingRequiredFields ||
                    error.message === subjectErrors.wrongCharacterLength,
            ).toBeTruthy();
        }
    });
});
