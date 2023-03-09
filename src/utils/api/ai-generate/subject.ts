import { subjectErrors } from './../../../errors/ai-email-generate';
export interface AIEmailSubjectGeneratorPostBody {
    brandName: string;
    productName: string;
    productDescription: string;
    company_id: string;
    user_id: string;
}

export const MAX_CHARACTER_LENGTH = 600;

export const generateSubjectPrompt = ({
    brandName,
    company_id,
    productDescription,
    productName,
    user_id,
}: AIEmailSubjectGeneratorPostBody) => {
    if (!brandName || !productDescription || !productName || !company_id || !user_id) {
        throw new Error(subjectErrors.missingRequiredFields);
    }

    if (brandName.length === 0 || productDescription.length === 0 || productName.length === 0) {
        throw new Error(subjectErrors.missingRequiredFields);
    }

    if (
        brandName.length > 100 ||
        productName.length > 100 ||
        productDescription.length > MAX_CHARACTER_LENGTH
    ) {
        throw new Error(subjectErrors.wrongCharacterLength);
    }

    const trimmedDescription = productDescription.trim();
    const trimDescriptionPunctuation = trimmedDescription.endsWith('.')
        ? trimmedDescription.slice(0, trimmedDescription.length - 1)
        : trimmedDescription;

    const prompt = `Generate a short email subject line, regarding a marketing campaign collaboration for our product ${productName}. Here is a description of the product: ${trimDescriptionPunctuation}. The subject line should start with a catchy and attention grabbing headline and after that mention that this is a marketing campaign collaboration invitation.`;

    return prompt;
};
