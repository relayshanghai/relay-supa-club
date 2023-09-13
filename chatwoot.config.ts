import type { ChatwootConfig } from 'src/utils/chatwoot/types';

const config: ChatwootConfig = {
    websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '',
};

export default config;
