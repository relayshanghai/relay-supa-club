import { Dialog, Transition } from '@headlessui/react';
import { Button } from './button';
import { Fragment } from 'react';

export interface ModalProps {
    visible: boolean;
    title?: string | JSX.Element;
    onClose: () => void;
    children: JSX.Element | JSX.Element[];
    closeButtonText?: string;
    okButtonText?: string | JSX.Element;
    onOkay?: () => void;
}

export const ModalWithButtons = ({
    children,
    visible,
    onClose,
    title,
    closeButtonText,
    okButtonText,
    onOkay,
}: ModalProps) => {
    return (
        <Transition appear show={visible} as={Fragment}>
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
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[2px]" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">{children}</div>
                                <div className="flex flex-row justify-end gap-2">
                                    {okButtonText && (
                                        <div className="mt-4">
                                            <Button type="button" variant="primary" onClick={onOkay}>
                                                {okButtonText}
                                            </Button>
                                        </div>
                                    )}

                                    {closeButtonText && (
                                        <div className="mt-4">
                                            <Button type="button" variant="secondary" onClick={() => onClose()}>
                                                {closeButtonText}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
