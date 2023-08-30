import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { cls } from 'src/utils/classnames';

type Props = PropsWithChildren<{
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}>;

export const OverlayRight = ({ children, isOpen = false, onOpen, ...props }: Props) => {
    const closeOverlay = useCallback(() => {
        props.onClose && props.onClose();
    }, [props]);

    const router = useRouter();

    useEffect(() => {
        if (isOpen && onOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    const overlayClass = useMemo(() => cls({ 'translate-x-full': !isOpen }), [isOpen]);
    const backdropClass = useMemo(() => cls({ hidden: !isOpen }), [isOpen]);

    return (
        <>
            <div
                className={`${overlayClass} fixed right-0 top-0 z-[60] h-full w-full ${
                    router.pathname.includes('influencer-manager') ? 'max-w-4xl' : 'max-w-md'
                } transform flex-col overflow-auto bg-white transition-all duration-300`}
                tabIndex={-1}
            >
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="mr-3 mt-3 h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => closeOverlay()}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>

            <div
                onClick={() => closeOverlay()}
                className={`${backdropClass} duration hs-overlay-backdrop fixed inset-0 z-50 bg-gray-400 bg-opacity-80 transition dark:bg-opacity-80`}
            />
        </>
    );
};
