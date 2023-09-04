import type { ZodType } from 'zod';
import { z } from 'zod';

/**
 * Convenience utility type for inferring zod inputs or outputs
 *
 *  Returns the inferred input type by default
 *
 *  To return the output type:
 *   `type FooZodSchemaType = zinfer<typeof FooZodSchema, 'o'>`
 *
 *  @see https://zod.dev/?id=type-inference for more info regarding __Type Inference__
 */
export type zInfer<T extends ZodType, X extends 'o' | 'i' = 'i'> = X extends 'i' ? z.input<T> : z.infer<T>;

/**
 * Create a Zod Type from custom type
 */
export const zType = <T>() => z.any() as z.ZodType<T>;

export const isNumeric = (v: any): v is number => {
    return v !== null && !isNaN(Number(v));
};

/**
 * Return a zod object for boolish values
 *
 *  True values: "true", "1", 1, true
 *  False values: "false", "0", 0, false, null, undefined
 */
export const boolish = () => {
    const o = z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()]);

    return o
        .refine((v) => {
            return (
                v === 'true' ||
                v === '1' ||
                v === 1 ||
                v === true ||
                v === 'false' ||
                v === '0' ||
                v === 0 ||
                v === false ||
                v === null ||
                v === undefined
            );
        })
        .transform((v) => {
            return v === 'true' || v === '1' || v === 1 || v === true;
        });
};
