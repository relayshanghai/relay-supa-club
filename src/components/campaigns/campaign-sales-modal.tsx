import { Modal } from '../modal';
import { Button } from '../button';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const [error, setError] = useState<boolean>(false);

    const handleSubmit = useCallback(() => {
        if (isNaN(amount)) {
            setError(true);
            return;
        }
        onAddSales(amount);
        setShow(false);
    }, [amount, onAddSales, setShow]);

    return (
        <Modal
            visible={show}
            maxWidth="max-w-sm"
            onClose={() => setShow(false)}
            title={t('campaigns.addSalesModal.title') || ''}
        >
            <div className="mt-6 flex flex-col items-center justify-between gap-6">
                <div className="flex w-full flex-row items-center gap-2">
                    <p>{t('campaigns.addSalesModal.currency')}</p>
                    <div className="w-full rounded-full">
                        <input
                            className={`input-field ${error && 'border-red-500 focus-within:border-red-500'}`}
                            autoComplete="off"
                            data-testid="campaign-sales-input"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAmount(parseFloat(e.target.value));
                                setError(false);
                            }}
                        />
                    </div>
                </div>
                {error && <p className="text-red-500">{t('campaigns.addSalesModal.error')}</p>}
                <Button className="w-full" onClick={handleSubmit}>
                    {t('campaigns.addSalesModal.modalButton')}
                </Button>
            </div>
        </Modal>
    );
};
