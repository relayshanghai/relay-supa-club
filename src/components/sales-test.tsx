import { useState } from 'react';
import { addSales, getSales } from 'src/utils/client-db/sales';
import { useDB } from 'src/utils/client-db/use-client-db';

const SalesTestComponent = () => {
    const addToSales = useDB<typeof addSales>(addSales);
    const getFromSales = useDB<typeof getSales>(getSales);
    const [sales, setSales] = useState<number>(0);
    const companyID = 'a02811bb-8920-45b0-ba99-ce64c61d1855';
    const campaignID = '6fa76f19-2860-4926-8e06-39a8fec71eb7';
    return (
        <div>
            <button
                data-testid="add-sales"
                onClick={() => addToSales({ company_id: companyID, campaign_id: campaignID, amount: 100 })}
            >
                Add to sales
            </button>
            <button data-testid="get-sales" onClick={async () => setSales(await getFromSales(companyID))}>
                Get from sales
            </button>
            <label data-testid="show-sales">{sales}</label>
        </div>
    );
};

export default SalesTestComponent;
