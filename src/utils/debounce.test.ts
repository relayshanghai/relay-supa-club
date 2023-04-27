import { debounce } from './debounce';

describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay execution of the passed function', () => {
        const callback = jest.fn();
        const debouncedCallback = debounce(callback);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(500);
        expect(callback).toBeCalled();

        debouncedCallback();
        expect(callback).toBeCalledTimes(1);

        jest.advanceTimersByTime(500);
        expect(callback).toBeCalledTimes(2);
    });

    it('should cancel and reset the delay if called multiple times', () => {
        const callback = jest.fn();
        const debouncedCallback = debounce(callback);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        debouncedCallback();
        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(250);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(550);
        expect(callback).toBeCalledTimes(1);

        debouncedCallback();
        expect(callback).toBeCalledTimes(1);

        jest.advanceTimersByTime(550);
        expect(callback).toBeCalledTimes(2);
    });

    it('should accept custom waitMs value', () => {
        const callback = jest.fn();
        const debouncedCallback = debounce(callback, 900);

        debouncedCallback();
        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(500);
        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(500);
        expect(callback).toBeCalledTimes(1);
    });
});
