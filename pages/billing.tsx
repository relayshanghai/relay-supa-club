import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BillingBalance from 'src/components/billing/billing-balance';
import EmptyBalance from 'src/components/billing/billing-empty-balance';
import BillingHistory from 'src/components/billing/billing-history';
import { Layout } from 'src/modules/layout';

import { handleError } from 'src/utils/utils';

const Billing = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [history, setHistory] = useState([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activePlans, setActivePlans] = useState([]);

    const fetchBillingHistory = async () => {
        try {
            // const res = await Promise.all([http.get('plan_purchases'), http.get('account_plans/active')]);
            // const res = await Promise.all([supabase.from('plan_purchases').select('*'), supabase.from('account_plans').select('*')]);
            // console.log(res);
            // setHistory(res[0]?.data.plan_purchases)
            // setActivePlans(res[1]?.data.account_plans)
        } catch (error) {
            toast(handleError(error));
            // console.log(error);
        }
    };

    useEffect(() => {
        fetchBillingHistory();
    }, []);

    return (
        <Layout>
            <div className="p-6">
                {activePlans.length ? (
                    activePlans.map((plan, index) => (
                        <div key={index}>
                            <BillingBalance activePlan={plan} />
                        </div>
                    ))
                ) : (
                    <EmptyBalance />
                )}
                {/* <PaymentPlan /> */}
                <BillingHistory history={history} />
            </div>
        </Layout>
    );
};
export default Billing;
