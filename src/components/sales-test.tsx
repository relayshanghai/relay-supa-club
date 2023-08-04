import { useEffect, useState } from 'react';
import { addSales, deleteSales, getSales } from 'src/utils/api/db/calls/sales';
import { useDB } from 'src/utils/client-db/use-client-db';

const SalesTestComponent = (data: { companyID: string; campaignID: string; amount: number }) => {
    const addToSales = useDB<typeof addSales>(addSales);
    const getFromSales = useDB<typeof getSales>(getSales);
    const deleteFromSales = useDB<typeof deleteSales>(deleteSales);
    const [sales, setSales] = useState<number>(0);
    useEffect(() => {
        deleteFromSales(data.companyID);
    }, [deleteFromSales, data]);
    return (
        <div>
            <button
                data-testid="add-sales"
                onClick={() =>
                    addToSales({ company_id: data.companyID, campaign_id: data.campaignID, amount: data.amount })
                }
            >
                Add to sales
            </button>
            <button data-testid="get-sales" onClick={async () => setSales(await getFromSales(data.companyID))}>
                Get from sales
            </button>
            <label data-testid="show-sales">{sales}</label>
        </div>
    );
};

export default SalesTestComponent;
