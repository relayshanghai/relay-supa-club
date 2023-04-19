import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface ModalProps {
    visible: boolean;
    title?: string | JSX.Element;
    onClose: (value: boolean) => void;
    children: JSX.Element | JSX.Element[];
}

export const Modal: React.FC<ModalProps> = ({ children, visible, onClose, title }) => {
    return (
        <Transition appear={visible} show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-tertiary-100 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="mb-4 text-xl font-semibold leading-6 text-tertiary-600"
                                >
                                    {title}
                                </Dialog.Title>

                                <>{children}</>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
