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
