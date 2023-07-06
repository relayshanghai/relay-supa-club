import { z } from 'zod';

type JsonParseArgs = [text: string, reviver?: Parameters<typeof JSON.parse>[1], throwOnerror?: boolean];

/**
 * Parse JSON strings
 *
 *  Returns `false` on failure. Optionally, throw an error if `throwOnError` is `true`
 */
export const parseJson: <T = any>(...args: JsonParseArgs) => T | false = (text, reviver?, throwOnError = false) => {
    try {
        return JSON.parse(text, reviver);
    } catch (e) {
        if (throwOnError === true) {
            throw e;
        }
    }

    return false;
};

const Literals = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof Literals>;
type Jsonable = Literal | { [key: string]: Jsonable } | Jsonable[];

export const Json: z.ZodType<Jsonable> = z.lazy(() => z.union([Literals, z.array(Json), z.record(Json)]));

/**
 * Since a valid JSON can be ALSO be a non empty string, a number, boolean or null,
 * JsonRoot expects the "root" to always be an object or array (not a literal)
 */
export const JsonRoot = z.lazy(() => z.union([z.array(Json), z.record(Json)]));
