import { emailErrors } from './../../../errors/ai-email-generate';
export interface AIEmailGeneratorPostBody {
    brandName: string;
    influencerName: string;
    productName: string;
    productDescription: string;
    instructions?: string;
    senderName: string;
    company_id: string;
    user_id: string;
}

export const MAX_CHARACTER_LENGTH = 600;

export const generateEmailPrompt = ({
    brandName,
    company_id,
    influencerName,
    productDescription,
    productName,
    senderName,
    user_id,
    instructions,
}: AIEmailGeneratorPostBody) => {
    if (
        !brandName ||
        !influencerName ||
        !productDescription ||
        !productName ||
        !senderName ||
        !company_id ||
        !user_id
    ) {
        throw new Error(emailErrors.missingRequiredFields);
    }

    if (
        brandName.length === 0 ||
        influencerName.length === 0 ||
        productDescription.length === 0 ||
        productName.length === 0 ||
        senderName.length === 0
    ) {
        throw new Error(emailErrors.missingRequiredFields);
    }

    if (
        brandName.length > 100 ||
        influencerName.length > 100 ||
        productName.length > 100 ||
        senderName.length > 100 ||
        productDescription.length > MAX_CHARACTER_LENGTH ||
        (instructions && instructions.length > MAX_CHARACTER_LENGTH)
    ) {
        throw new Error(emailErrors.wrongCharacterLength);
    }

    const trimmedDescription = productDescription.trim();
    const trimDescriptionPunctuation = trimmedDescription.endsWith('.')
        ? trimmedDescription.slice(0, trimmedDescription.length - 1)
        : trimmedDescription;

    const trimmedInstructions = instructions?.trim();
    const trimmedInstructionsPunctuation = trimmedInstructions?.endsWith('.')
        ? trimmedInstructions?.slice(0, trimmedInstructions?.length - 1)
        : trimmedInstructions;

    const prompt = `Write an email (without subject) to ${influencerName} with the following content:
	1) Express our brand ${brandName}'s interest in participating with them on a product marketing campaign.
	2) Express that I love their content and appreciate their creativity.
	3) Introduce our product: ${brandName} ${productName}. ${trimDescriptionPunctuation}.
	${
        instructions
            ? `4) Ask them to follow these instructions: ${trimmedInstructionsPunctuation}.`
            : '4) Ask them to post about the product on their social media.'
    }
	5) Express my gratitude for ${influencerName}'s time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration.
	6) Sign with the name: ${senderName}`;

    return {
        prompt: prompt,
    };
};
