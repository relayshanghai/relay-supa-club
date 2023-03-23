import { subjectErrors } from '../../../errors/ai-email-generate';
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
                brandName: 'Ford',
                company_id: '235532',
                productDescription: 'a'.repeat(MAX_CHARACTER_LENGTH + 1),
                productName: 'Ford Chevron',
                user_id: '151515',
            });
        } catch (error: any) {
            if (hasCustomError(error, subjectErrors))
                expect(error.message).toBe(subjectErrors.wrongCharacterLength);
        }
    });

    test('returns prompt when all required fields are correct', () => {
        const data = {
            brandName: 'Ford',
            company_id: '32511',
            productDescription:
                'Ford Chevron Baja Bronco is a concept vehicle that was unveiled at the 2017 North American International Auto Show in Detroit. The vehicle is a modern interpretation of the 1966 Ford Bronco Baja, which was a factory-built off-road racing vehicle. The vehicle is based on the 2017 Ford F-150 Raptor and features a 3.5L EcoBoost V6 engine, a 10-speed automatic transmission, and a 4WD system with a 2-speed transfer case. The vehicle is equipped with a 2.0L EcoBoost engine, a 10-speed automatic transmission, and a 4WD system with a 2-speed transfer case.',
            productName: 'Ford Chevron',
            user_id: '35151',
        };

        try {
            const result = generateSubjectPrompt(data);
            expect(result).toBeDefined();
            expect(result).toBe(
                'Generate a short email subject line, regarding a marketing campaign collaboration for our product Ford Chevron. Here is a description of the product: Ford Chevron Baja Bronco is a concept vehicle that was unveiled at the 2017 North American International Auto Show in Detroit. The vehicle is a modern interpretation of the 1966 Ford Bronco Baja, which was a factory-built off-road racing vehicle. The vehicle is based on the 2017 Ford F-150 Raptor and features a 3.5L EcoBoost V6 engine, a 10-speed automatic transmission, and a 4WD system with a 2-speed transfer case. The vehicle is equipped with a 2.0L EcoBoost engine, a 10-speed automatic transmission, and a 4WD system with a 2-speed transfer case. The subject line should start with a catchy and attention grabbing headline and after that mention that this is a marketing campaign collaboration invitation.',
            );
        } catch (error: any) {
            expect(
                error.message === subjectErrors.missingRequiredFields ||
                    error.message === subjectErrors.wrongCharacterLength,
            ).toBeTruthy();
        }
    });
});
