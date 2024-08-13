import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface ModalProps {
    visible: boolean;
    title?: string | JSX.Element;
    onClose: (value: boolean) => void;
    children: JSX.Element | JSX.Element[];
    /** a tailwind max-w class e.g. max-w-lg */
    maxWidth?: string;
    padding?: number;
}

export const Default: React.FC<ModalProps> = ({
    children,
    visible,
    onClose,
    title,
    maxWidth = 'max-w-md',
    padding = 6,
}) => {
    return (
        <Transition appear show={visible} as={Fragment}>
            <Dialog open={visible} as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-[2px]" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`w-full ${maxWidth} transform overflow-visible rounded-lg bg-gray-50 p-${padding} text-left align-middle shadow-xl transition-all`}
                            >
                                {title && (
                                    <Dialog.Title
                                        as="h3"
                                        className="my-2 text-2xl font-semibold leading-6 text-gray-600"
                                    >
                                        {title}
                                    </Dialog.Title>
                                )}
                                <>{children}</>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
