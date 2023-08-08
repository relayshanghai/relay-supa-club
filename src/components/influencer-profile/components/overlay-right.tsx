import type { PropsWithChildren } from 'react';
import React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cls } from 'src/utils/classnames';

type Props = PropsWithChildren<{
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}>;

export const OverlayRight = ({ children, ...props }: Props) => {
    const { isOpen } = { isOpen: false, ...props };

    const closeOverlay = useCallback(() => {
        props.onClose && props.onClose();
    }, [props]);

    useEffect(() => {
        isOpen && props.onOpen && props.onOpen();
    }, [isOpen, props]);

    const overlayCls = useMemo(() => cls({ 'translate-x-full': !isOpen }), [isOpen]);
    const backdropCls = useMemo(() => cls({ hidden: !isOpen }), [isOpen]);

    return (
        <>
            <div
                className={`${overlayCls} fixed right-0 top-0 z-[60] h-full w-full max-w-md transform bg-white transition-all duration-300`}
                tabIndex={-1}
            >
                <div className="float-right flex px-3 py-3">
                    <button
                        onClick={() => closeOverlay()}
                        type="button"
                        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>

            <div
                onClick={() => closeOverlay()}
                className={`${backdropCls} duration hs-overlay-backdrop fixed inset-0 z-50 bg-gray-400 bg-opacity-80 transition dark:bg-opacity-80`}
            />
        </>
    );
};
