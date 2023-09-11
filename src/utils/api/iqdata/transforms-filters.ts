import type { CreatorAccount, LocationWeighted } from 'types';
import type {
    SearchInfluencersTextTagsFilter,
    with_contact,
    engagement_rate,
} from './influencers/search-influencers-payload';
import {
    last_posted,
    gender_code,
    audience_age_range,
    audience_gender,
    actions,
} from './influencers/search-influencers-payload';
import { serverLogger } from 'src/utils/logger-server';
import type { z } from 'zod';
import { createClient } from 'src/utils/rudderstack/rudderstack';

type NullStringTuple = [null | string, null | string];

export const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id: Number(id),
    weight: weight ? Number(weight) / 100 : 0.5,
});

export const genderFilter = (value: z.input<typeof gender_code>) => {
    const code = gender_code.parse(value);
    return { code };
};

export const audienceGenderFilter = (value: z.input<typeof audience_gender>) => {
    return audience_gender.parse(value);
};

export const textFilter = (value: string) => {
    return value;
};

export const keywordsFilter = (value: string) => {
    return value;
};

export const lastPostedFilter = (value: z.input<typeof last_posted>) => {
    return last_posted.parse(value);
};

export const usernameFilter = (value: string) => {
    return { value };
};

export const leftRightNumberTransform = (tuple: NullStringTuple) => {
    const [left_number, right_number] = tuple;
    const filter: { left_number?: number; right_number?: number } = {};

    if (left_number) {
        filter.left_number = +left_number;
    }

    if (right_number) {
        filter.right_number = +right_number;
    }

    return filter;
};

/**
 * @see https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/352
 */
export const recommendedInfluencersFilter = (influencers: string[]) => {
    const ids = influencers.map((influencer) => influencer.split('/')[1]);

    if (ids.length > 1000) {
        serverLogger('Recommended influencer ids truncated');
        return ids.slice(0, 1000);
    }

    return ids;
};

export const textTagsFilter = (s: string) => {
    const tags = s.trim().split(' ');

    return tags.reduce<SearchInfluencersTextTagsFilter[]>((o, value) => {
        return [...o, { type: 'hashtag', value }];
    }, []);
};

export const tagsFilter = (value: { tag: string }[]) => {
    const tags = value.map((tag) => `#${tag.tag}`);

    return tags.join(' ');
};

export const lookalikeFilter = (value: CreatorAccount[]) => {
    const lookalikes = value.map((account) => `@${account.user_id}`);

    return lookalikes.join(' ');
};

export const viewsFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

export const audienceFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

export const audienceLocationFilter = (value: LocationWeighted[]) => {
    if (value.length <= 0) {
        return undefined;
    }

    return value.map(locationTransform) || [];
};

export const influencerLocationFilter = (value: LocationWeighted[]) => {
    if (value.length <= 0) {
        return undefined;
    }

    return value.map(locationTransform) || [];
};

export const engagementFilter = (value: string | number) => {
    const rate = +(+value / 100).toFixed(2);

    return { value: rate, operator: 'gte' } as z.infer<typeof engagement_rate>;
};

export const contactInfoFilter = (value: string[]) => {
    const contactType = value.map((v) => {
        if (v === 'email') {
            return { type: 'email', action: 'should' };
        }
    });

    return contactType.filter((v) => !!v) as z.infer<typeof with_contact>[];
};

export const influencerAgeFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

export const audienceAgeFilter = (value: z.input<typeof audience_age_range>) => {
    return audience_age_range.parse(value);
};

export const actionsFilter = (filters: z.input<typeof actions>[]) => {
    return actions.array().parse(filters);
};

export const withRudderStack =
    <FilterFunctionType extends (...args: any[]) => any>(filterFunction: FilterFunctionType, searchEvent: string) =>
    (...args: Parameters<FilterFunctionType>) => {
        const result = filterFunction(...args);
        const rudder = createClient();
        rudder.track({
            event: searchEvent,
            ...args,
        });
        return result;
    };
