import { atom } from 'jotai';
import { nanoid } from 'nanoid';

export const deviceIdAtom = atom<string>(nanoid());
