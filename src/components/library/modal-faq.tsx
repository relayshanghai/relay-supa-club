import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import type { AccordionContent } from './accordion';
import { Accordion } from './accordion';
import { Cross } from '../icons';

export interface FaqModalProps extends Omit<ModalProps, 'children'> {
    content: AccordionContent[];
    title: string;
    description?: string | null;
    getMoreInfoButtonText?: string;
    /** will close the modal and then call this */
    getMoreInfoButtonAction?: () => void;
}

export const FaqModal = ({
    content,
    title,
    description,
    getMoreInfoButtonText,
    getMoreInfoButtonAction,
    ...modalProps
}: FaqModalProps) => {
    const { t } = useTranslation();
    return (
        <Modal {...modalProps} maxWidth="max-w-2xl" padding={0}>
            <div className="flex w-full rounded-lg bg-primary-100 p-6">
                <section className="flex flex-col gap-2">
                    <h2 className="w-full text-2xl text-primary-500">{title} </h2>
                    {description && <p>{description}</p>}
                </section>
                <button
                    data-testid="faq-modal-close-button"
                    className="ml-auto"
                    onClick={() => modalProps.onClose(false)}
                >
                    <Cross className="h-6 w-6 fill-primary-500 " />
                </button>
            </div>
            <div className="mb-6 divide-y divide-gray-900/10 px-6">
                <Accordion content={content} modalName={title} type="FAQ" />
            </div>
            <div className="flex flex-row justify-end gap-6 p-6">
                <div className="mt-4">
                    <Button variant="ghost" onClick={() => modalProps.onClose(false)}>
                        {t('website.back')}
                    </Button>
                </div>
                {getMoreInfoButtonText && getMoreInfoButtonAction && (
                    <div className="mt-4">
                        <Button
                            variant="primary"
                            onClick={() => {
                                modalProps.onClose(false);
                                getMoreInfoButtonAction();
                            }}
                        >
                            {getMoreInfoButtonText}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
