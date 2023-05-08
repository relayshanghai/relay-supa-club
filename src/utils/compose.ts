type PickLastFnParam<T extends any[]> = T extends [...rest: infer _, argn: infer L] ? L : (a: any) => any;

/**
 * Composes a list of functions to return a new function that applies each function from right to left
 * @param {Array<Function>} fns - List of functions to be composed
 * @returns {Function} - New function that applies each function from right to left
 */
export const compose =
    <T extends ((arg: any) => any)[]>(...fns: T) =>
    (initialParam: Parameters<PickLastFnParam<T>>[0]): ReturnType<T[0]> =>
        fns.reduceRight((accumulator: any, currentFn: any) => currentFn(accumulator), initialParam);
