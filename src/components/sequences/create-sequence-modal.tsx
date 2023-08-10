import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import type { ModalProps } from '../modal';
import { Input } from '../input';

export const CreateSequenceModal = (props: Omit<ModalProps, 'children'>) => {
    const { t } = useTranslation();

    return (
        <Modal {...props}>
            <div className="space-y-4 py-6">
                <div className="font-semibold text-gray-600">{t('sequences.sequenceInfo')}l</div>
                <Input label={t('sequences.sequenceName')} />
                <Input label={t('sequences.product')} />
                <Input label={t('sequences.outreachEmail')} />
            </div>
        </Modal>
    );
};
