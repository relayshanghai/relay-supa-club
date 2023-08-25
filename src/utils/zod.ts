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
    return v !== null && !isNaN(Number(v))
}

/**
 * Return a zod object for boolish values
 *
 *  True values: "true", "1", 1, true
 *  False values: "false", "0", 0, false, null, undefined
 */
export const boolish = () => {
    const o = z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])

    const refined = o.refine((v) => {
        if (typeof v === "boolean") {
            return true;
        }

        if (v === null || v === undefined) {
            return true;
        }

        if (isNumeric(v) && (Number(v) === 0 || Number(v) === 1)) {
            return true;
        }

        const allowedStrings = ["true", "false", "0", "1"]

        if (typeof v === "string" && allowedStrings.includes(v.toLowerCase())) {
            return true;
        }

        return false;
    }).transform((v) => {
        if (typeof v === "boolean") {
            return v;
        }

        if (v === null || v === undefined) {
            return false;
        }

        if (typeof v === "string" && ["true", "1"].includes(v.toLowerCase())) {
            return true;
        }

        if (typeof v === "string" && ["false", "0"].includes(v.toLowerCase())) {
            return false;
        }

        if (isNumeric(v) && [0, 1].includes(Number(v))) {
            return Boolean(Number(v))
        }

        return Boolean(v)
    })

    return refined
}
