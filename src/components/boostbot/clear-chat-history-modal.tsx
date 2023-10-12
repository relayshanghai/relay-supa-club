import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';

type ClearChatHistoryModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onConfirm: () => void;
};

export const ClearChatHistoryModal = ({ isOpen, setIsOpen, onConfirm }: ClearChatHistoryModalProps) => {
    const { t } = useTranslation();

    const confirmModal = () => {
        setIsOpen(false);
        onConfirm();
    };

    return (
        <Modal maxWidth="max-w-3xl" visible={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h3>{t('boostbot.chat.clearChatModal.title')}</h3>

                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        {t('boostbot.chat.clearChatModal.cancel')}
                    </Button>

                    <Button data-testid="boostbot-confirm-filters" onClick={confirmModal}>
                        {t('boostbot.chat.clearChatModal.confirm')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
