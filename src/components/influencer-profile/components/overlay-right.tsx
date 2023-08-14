import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cls } from 'src/utils/classnames';

type Props = PropsWithChildren<{
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}>;

export const OverlayRight = ({ children, onOpen, ...props }: Props) => {
    const { isOpen } = { isOpen: false, ...props };
    const [isOpenLocal, setIsOpenLocal] = useState(isOpen);

    const closeOverlay = useCallback(() => {
        props.onClose && props.onClose();
    }, [props]);

    // @note listen for update in props.isOpen and apply to local state
    useEffect(() => {
        setIsOpenLocal((s) => (s !== isOpen ? isOpen : s));
    }, [isOpen]);

    useEffect(() => {
        isOpenLocal && onOpen && onOpen();
    }, [isOpenLocal, onOpen]);

    const overlayCls = useMemo(() => cls({ 'translate-x-full': !isOpen }), [isOpen]);
    const backdropCls = useMemo(() => cls({ hidden: !isOpen }), [isOpen]);

    return (
        <>
            <div
                className={`${overlayCls} fixed right-0 top-0 z-[60] h-full w-full max-w-md transform flex-col overflow-auto bg-white transition-all duration-300`}
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
                className={`${backdropCls} duration hs-overlay-backdrop fixed inset-0 z-50 bg-gray-400 bg-opacity-80 transition dark:bg-opacity-80`}
            />
        </>
    );
};
