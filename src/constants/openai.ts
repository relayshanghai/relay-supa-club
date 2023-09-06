import { serverLogger } from 'src/utils/logger-server';

export const OPENAI_API_ORG = process.env.OPENAI_API_ORG;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_ORG || !OPENAI_API_KEY) {
    serverLogger('Missing OpenAI API key or organization');
}
