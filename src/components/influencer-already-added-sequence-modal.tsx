import type { ModalProps } from './modal';
import { useTranslation } from 'react-i18next';
import { Modal } from './modal';
import { Button } from './button';

export interface InfluencerAlreadyAddedSequenceModalProps extends Omit<ModalProps, 'children'> {
    alreadyAddedSequence: string;
}
export const InfluencerAlreadyAddedSequenceModal = ({
    alreadyAddedSequence,
    ...props
}: InfluencerAlreadyAddedSequenceModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal {...props} title={t('creators.addToSequence') || ''}>
            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p>{t('sequences.influencerAlreadyAdded_sequence', { sequence: alreadyAddedSequence })}</p>
                </div>
                <Button onClick={() => props.onClose(false)}>{t('creators.close')}</Button>
            </section>
        </Modal>
    );
};
