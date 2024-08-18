import type { Editor } from '@tiptap/react';
import { atom } from 'jotai';

export const currentEditorAtom = atom<Editor | null>(null);
