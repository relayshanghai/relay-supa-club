import { type StateCreator, type StoreMutatorIdentifier, create as c } from 'zustand';
import { devtools } from 'zustand/middleware';

export const create = <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
) => c(devtools(initializer));
