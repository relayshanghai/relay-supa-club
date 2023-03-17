import { useEffect, KeyboardEvent } from 'react';

function useOnOutsideClick(
    ref: React.MutableRefObject<any>,
    handler: (e: MouseEvent | TouchEvent | KeyboardEvent) => void,
    secondRef?: React.MutableRefObject<any>,
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const element = ref?.current;
            // Do nothing if clicking ref's element or descendent elements
            if (!element || element.contains(event.target)) {
                return;
            }
            if (secondRef) {
                const secondElement = secondRef?.current;
                if (secondElement && secondElement.contains(event.target)) {
                    return;
                }
            }
            handler(event);
        };

        const keyboardListener = (event: any) => {
            if (event.key === 'Escape') {
                if (secondRef) {
                    const secondElement = secondRef?.current;
                    if (secondElement && secondElement.contains(event.target)) {
                        return;
                    }
                }
                handler(event);
            }
        };

        document.addEventListener(`mousedown`, listener);
        document.addEventListener(`keydown`, keyboardListener, true);
        document.addEventListener(`touchstart`, listener);

        return () => {
            document.removeEventListener(`mousedown`, listener);
            document.removeEventListener(`keydown`, keyboardListener);
            document.removeEventListener(`touchstart`, listener);
        };
    }, [ref, handler, secondRef]);
}

export default useOnOutsideClick;
