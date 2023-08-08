import type { PropsWithChildren } from 'react';
import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cls } from 'src/utils/classnames';

type Props = PropsWithChildren<{
    onOpen?: () => void;
    onClose?: () => void;
}>;

export const OverlayRight = ({ children, ...props }: Props) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOverlay = useCallback(() => {
        setIsOpen((state) => !state);
    }, [setIsOpen]);

    useEffect(() => {
        isOpen && props.onOpen && props.onOpen();
        !isOpen && props.onClose && props.onClose();
    }, [isOpen, props]);

    const overlayCls = useMemo(() => cls({ '-translate-x-0': isOpen }), [isOpen]);
    const backdropCls = useMemo(() => cls({ hidden: !isOpen }), [isOpen]);

    return (
        <>
            <nav className="flex space-x-2">
                <button
                    onClick={() => toggleOverlay()}
                    type="button"
                    className={`inline-flex grow basis-0 items-center justify-center gap-2 rounded-lg bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:hover:text-gray-300 dark:hover:text-gray-400`}
                >
                    Toggle Overlay
                </button>
            </nav>

            <div
                className={`${overlayCls} fixed right-0 top-0 z-[60] h-full w-full max-w-md translate-x-full transform bg-white transition-all duration-300`}
                tabIndex={-1}
            >
                <div className="float-right flex px-3 py-3">
                    <button
                        onClick={() => toggleOverlay()}
                        type="button"
                        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>

            <div
                onClick={() => toggleOverlay()}
                className={`${backdropCls} duration hs-overlay-backdrop fixed inset-0 z-50 bg-gray-400 bg-opacity-80 transition dark:bg-opacity-80`}
            />
        </>
    );
};
