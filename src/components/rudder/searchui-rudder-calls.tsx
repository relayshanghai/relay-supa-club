import { rudderInitialized } from 'src/utils/rudder-initialize';

export const wordCloudAddTag = async (item: { word: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('WordCloud Component, Added tag from wordcloud', item);
};

export const wordCloudRemoveTag = async (item: { word: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('WordCloud Component, Removed tag from wordcloud', item);
};

export const audienceSetAgeFrom = async (age: { lower: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set audience lower age filter limit', age);
};

export const audienceSetAgeTo = async (age: { upper: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set audience upper age filter limit', age);
};

export const audienceSetAgeWeight = async (age: { weight: number }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set audience age filter weight', age);
};

export const audienceSetGender = async (gender: { code: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set audience gender filter', gender);
};

export const audienceSetGenderWeight = async (gender: { weight: number }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set audience gender filter weight', gender);
};

export const influencerSetGender = async (gender: { code: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set influencer gender filter', gender);
};

export const influencerSetGenderWeight = async (gender: { weight: number }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set influencer gender filter weight', gender);
};

export const influencerSetHasEmail = async (contactInfo: { mode: string }) => {
    if (!window.rudder) {
        await rudderInitialized();
    }
    window.rudder.track('Search Options, Set influencer gender filter parameters', contactInfo);
};
