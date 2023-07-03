import { Modal } from '../modal';
import { Button } from '../button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

export const CampaignSalesModal = ({
    show,
    setShow,
    onAddSales,
}: {
    show: boolean;
    setShow: (open: boolean) => void;
    onAddSales: (amount: number) => Promise<void>;
}) => {
    const { t } = useTranslation();

    const [amount, setAmount] = useState<number>(0);

    return (
        <Modal
            visible={show}
            maxWidth={`max-w-md`}
            onClose={() => setShow(false)}
            title={t('campaigns.addSalesModal.title') || ''}
        >
            <div className="flex flex-row items-center justify-between gap-4">
                <p>{t('campaigns.addSalesModal.currency')}</p>
                <div className="w-full rounded-full">
                    <input
                        className="input-field"
                        type="number"
                        autoComplete="off"
                        data-testid="campaign-sales-input"
                        onChange={(e) => {
                            const input = parseFloat(e.target.value);
                            if (isNaN(input)) {
                                toast.error('Please enter a number!');
                                return;
                            }
                            setAmount(parseFloat(e.target.value));
                        }}
                    />
                </div>
                <Button
                    onClick={() => {
                        onAddSales(amount);
                        setShow(false);
                    }}
                >
                    {t('campaigns.addSalesModal.modalButton')}
                </Button>
            </div>
        </Modal>
    );
};
