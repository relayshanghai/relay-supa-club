// @todo join all utils for this domain here
import { SocialPlatforms } from './types';
import type { SocialPlatformID } from './types';

// @todo: we can probably auto detect platforms based on id
export const generatePlatformID = (id: string, string: keyof typeof SocialPlatforms): SocialPlatformID => {
    return [id, SocialPlatforms[string]];
};
