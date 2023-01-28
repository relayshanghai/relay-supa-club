import { useEffect } from 'react';

function useOnOutsideClick(
    ref: React.MutableRefObject<any>,
    handler: (e: MouseEvent | TouchEvent) => void,
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

        document.addEventListener(`mousedown`, listener);
        document.addEventListener(`touchstart`, listener);

        return () => {
            document.removeEventListener(`mousedown`, listener);
            document.removeEventListener(`touchstart`, listener);
        };
    }, [ref, handler, secondRef]);
}

export default useOnOutsideClick;
