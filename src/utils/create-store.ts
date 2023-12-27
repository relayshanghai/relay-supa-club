import { useSyncExternalStore } from 'react';

const createInternalStore = <T>(initialState: T) => {
    let state = initialState;
    const listeners = new Set<() => void>();

    function setStore(value: T | ((state: T) => T)) {
        if (value instanceof Function) {
            state = value(state);
        }

        if (!(value instanceof Function)) {
            state = value;
        }

        listeners.forEach((listener) => listener());
    }

    function getSnapshot() {
        return state;
    }

    function getServerSnapshot() {
        return initialState;
    }

    function subscribe(listener: () => void) {
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    }

    return {
        setStore,
        getSnapshot,
        getServerSnapshot,
        subscribe,
    };
};

/**
 * Helper function for creating storages of sharable state between components
 *
 * This can be easily be over-used so please use sparingly. Preferrably for sharing states that
 * are "small" such as user interface data (e.g. isDarkTheme, isModalOpen).
 */
export const createStore = <T>(initialValue: T) => {
    const store = createInternalStore<T>(initialValue);

    const useStore = () => {
        const externalStore = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

        return [externalStore, store.setStore] as [T, typeof store.setStore];
    };

    return useStore;
};
