import { serverLogger } from 'src/utils/logger';

export const OPENAI_API_ORG = process.env.OPENAI_API_ORG;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_ORG || !OPENAI_API_KEY) {
    serverLogger('Missing OpenAI API key or organization', 'error');
}

export const AI_EMAIL_TRIAL_USAGE_LIMIT = '50';
export const AI_EMAIL_SUBSCRIPTION_USAGE_LIMIT = '1000';
