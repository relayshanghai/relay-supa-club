import { setItem, getItem, removeItem } from '@analytics/storage-utils';
import { nanoid } from 'nanoid';
import journeys from './journeys';
import type { JourneyCollection, JourneyObject } from './types';
import { JourneyStatus } from './types';

const JOURNEY_STORAGE_KEY = 'relay.journey';

type JourneyIndex = { id: string; name: string }[];

type JourneyKeys = keyof typeof journeys;

export const getJourney = (name: JourneyKeys) => {
    const key = `${JOURNEY_STORAGE_KEY}.${name}`;
    return getItem<JourneyObject>(key);
};

const update = (journeys: JourneyCollection) => (name: JourneyKeys, payload?: any, tag?: string) => {
    const key = `${JOURNEY_STORAGE_KEY}.${name}`;
    const item = getItem<JourneyObject>(key);

    if (!item || item.name !== name) return false;

    const timestamp = new Date().getTime();

    const updated = setItem<JourneyObject>(key, {
        ...item,
        updated_at: timestamp,
        tag,
    });

    const { onUpdate } = journeys[updated.current.name]();

    if (onUpdate) {
        return onUpdate(updated.current, payload, tag);
    }

    return updated;
};

const end = (journeys: JourneyCollection) => (name: JourneyKeys, payload?: any) => {
    const key = `${JOURNEY_STORAGE_KEY}.${name}`;
    const item = getItem<JourneyObject>(key);

    if (!item || item.name !== name) return false;

    const timestamp = new Date().getTime();

    const updated = setItem<JourneyObject>(key, {
        ...item,
        status: JourneyStatus.ENDED,
        updated_at: timestamp,
    });

    const { onEnd } = journeys[updated.current.name]();

    if (onEnd) {
        return onEnd(updated.current, payload);
    }

    return updated;
};

const abort = (journeys: JourneyCollection) => (name: JourneyKeys, payload?: any) => {
    const key = `${JOURNEY_STORAGE_KEY}.${name}`;
    const item = getItem<JourneyObject>(key);

    if (!item || item.name !== name) return false;

    const timestamp = new Date().getTime();

    const updated = setItem<JourneyObject>(key, {
        ...item,
        status: JourneyStatus.ABORTED,
        updated_at: timestamp,
    });

    const { onAbort } = journeys[updated.current.name]();

    if (onAbort) {
        return onAbort(updated.current, payload);
    }

    return updated;
};

const start = (journeys: JourneyCollection) => (name: JourneyKeys, payload?: any, tag?: string) => {
    const id = nanoid();
    const key = `${JOURNEY_STORAGE_KEY}.${name}`;

    const timestamp = new Date().getTime();

    const item = setItem<JourneyObject>(key, {
        id,
        name,
        status: JourneyStatus.ONGOING,
        created_at: timestamp,
        updated_at: timestamp,
        tag,
    });

    const index = getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`) ?? [];
    setItem(`${JOURNEY_STORAGE_KEY}.__index`, [...index, { id, name }]);

    const { onStart } = journeys[name]();

    if (onStart) {
        return onStart(item.current, payload, tag);
    }

    return item.current;
};

export const listJourneys = () => getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`);

export const clearJourneys = () => {
    const index = getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`);

    if (!index) return;

    // @note refactor, expensive
    index.forEach(({ name }) => {
        removeItem(`${JOURNEY_STORAGE_KEY}.${name}`);
    });

    removeItem(`${JOURNEY_STORAGE_KEY}.__index`);
};

/**
 * Start a new journey
 */
export const startJourney = start(journeys);

export const updateJourney = update(journeys);

export const endJourney = end(journeys);

export const abortJourney = abort(journeys);
