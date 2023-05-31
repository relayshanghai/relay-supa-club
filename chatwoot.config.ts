import type { ChatwootConfig } from "src/components/chatwoot/chatwoot-provider";

const config: ChatwootConfig = {
    websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || ''
}

export default config
