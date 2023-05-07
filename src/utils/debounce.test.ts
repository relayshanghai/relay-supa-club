import { describe, expect, it, vitest } from 'vitest';

import { debounce } from './debounce';

describe('debounce', () => {
    vitest.useFakeTimers();

    it('should delay execution of the passed function', () => {
        const callback = vitest.fn();
        const debouncedCallback = debounce(callback);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        vitest.advanceTimersByTime(500);
        expect(callback).toBeCalled();

        debouncedCallback();
        expect(callback).toBeCalledTimes(1);

        vitest.advanceTimersByTime(500);
        expect(callback).toBeCalledTimes(2);
    });

    it('should cancel and reset the delay if called multiple times', () => {
        const callback = vitest.fn();
        const debouncedCallback = debounce(callback);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        debouncedCallback();
        expect(callback).not.toBeCalled();

        vitest.advanceTimersByTime(250);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        vitest.advanceTimersByTime(550);
        expect(callback).toBeCalledTimes(1);

        debouncedCallback();
        expect(callback).toBeCalledTimes(1);

        vitest.advanceTimersByTime(550);
        expect(callback).toBeCalledTimes(2);
    });

    it('should accept custom waitMs value', () => {
        const callback = vitest.fn();
        const debouncedCallback = debounce(callback, 900);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        vitest.advanceTimersByTime(500);
        expect(callback).not.toBeCalled();

        vitest.advanceTimersByTime(500);
        expect(callback).toBeCalledTimes(1);
    });
});
