import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type ModalProps = {
    visible: boolean;
    onClose: () => void;
    title?: string | ReactNode;
    children: ReactNode;
    className?: string;
};

export const Modal = ({ visible, onClose, title, className, children }: ModalProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(visible);
    }, [visible]);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    return (
        <>
            <div
                className={`fixed left-0 top-0 z-50 h-full w-full bg-black bg-opacity-50 ${show ? 'block' : 'hidden'}`}
                onClick={handleClose}
            />
            <div
                className={`fixed left-1/2 top-1/2 z-50 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg ${
                    show ? 'block' : 'hidden'
                } ${className}`}
            >
                <div className="text-xl font-semibold">{title}</div>

                <div>{children}</div>
            </div>
        </>
    );
};
