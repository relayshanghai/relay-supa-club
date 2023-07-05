import type { z, ZodType } from 'zod';

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
export type zinfer<T extends ZodType, X extends 'o' | 'i' = 'i'> = X extends 'i' ? z.input<T> : z.infer<T>;
