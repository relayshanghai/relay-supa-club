import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// Classname utility used with shadcn/ui
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type KVBool = { [key: string]: boolean | ((state?: any) => boolean) };

type FNClassBuilder = (state?: any) => ClassBuilder;

type ClassBuilder = string | string[] | FNClassBuilder | KVBool;

type buildClassNamesProps = [cls: ClassBuilder | ClassBuilder[], state?: any];

const buildClassNames: (...args: buildClassNamesProps) => string[] = (cls, state?) => {
    const mapped: string[] = [];

    if (Array.isArray(cls)) {
        cls.forEach((c) => mapped.push(...buildClassNames(c)));
    }

    if (typeof cls === 'string' && cls.trim() !== '') {
        mapped.push(cls);
    }

    if (typeof cls === 'function') {
        mapped.push(...buildClassNames(cls(state)));
    }

    if (Object.getPrototypeOf(cls) === Object.prototype) {
        Object.entries(cls).forEach(([k, v]) => {
            if (v || (typeof v === 'function' && v(state))) mapped.push(k);
        });
    }

    return mapped;
};

/**
 * Generate class-name strings from given values
 */
export const cls = (...args: buildClassNamesProps) => buildClassNames(...args).join(' ');
