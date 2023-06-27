import { Modal } from '../modal';
import { Button } from '../button';
import { useState } from 'react';

type CampagnSales = {
    campaign_id: string;
    company_id: string;
    amount: number;
};

export const CampaignSalesModal = ({
    show,
    setShow,
    onAddSales,
}: {
    show: boolean;
    setShow: (open: boolean) => void;
    onAddSales: (amount: number) => CampagnSales;
}) => {
    // const { t } = useTranslation();

    const [amount, setAmount] = useState<number>(0);

    return (
        <Modal visible={show} maxWidth={`max-w-md`} onClose={() => setShow(false)} title="Add Sales (USD)">
            <div className="flex flex-row items-center justify-between gap-4">
                <p>$</p>
                <div className="w-full rounded-full">
                    <input
                        className="input-field"
                        type="number"
                        autoComplete="off"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </div>
                <Button
                    onClick={() => {
                        // alert(amount);
                        onAddSales(amount);
                        setShow(false);
                    }}
                >
                    Add Amount
                </Button>
            </div>
        </Modal>
    );
};
