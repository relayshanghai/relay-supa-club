import type { StorageHandler } from '../types';

type Data = any;
type StoreObject = Data;

/**
 * Simple storage handler
 */
const simpleStorageHandler: StorageHandler<Data, StoreObject> = {
    /**
     * @inheritdoc
     */
    initialize(database, storeName) {
        if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName);
        }
    },

    /**
     * @inheritdoc
     */
    upgrade(database, storeName) {
        if (database.objectStoreNames.contains(storeName)) {
            database.deleteObjectStore(storeName);
        }

        this.initialize(database, storeName);
    },

    /**
     * @inheritdoc
     */
    replace: (key, value) => value,

    /**
     * @inheritdoc
     */
    revive: (key, storeObject) => storeObject,
} as const;

export default simpleStorageHandler;
