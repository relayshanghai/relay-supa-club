import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';

type InfluencerDetailsModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export const InfluencerDetailsModal = ({ isOpen, setIsOpen }: InfluencerDetailsModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal maxWidth="max-w-3xl" visible={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h3>Details Modal</h3>

                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>

                    <Button data-testid="boostbot-confirm-filters">Add to Sequence</Button>
                </div>
            </div>
        </Modal>
    );
};
