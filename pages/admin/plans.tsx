import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { type PlanEntity } from 'src/backend/database/plan/plan-entity';
import { PlansModal } from 'src/components/admin/PlansModal';
import { PlansRow } from 'src/components/admin/PlansRow';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { usePlans } from 'src/hooks/use-plans';

const columnHeaders = [
    'Item Name',
    'Price Type',
    'Billing Period',
    'Price',
    'Currency',
    'Price Id',
    'Original Price',
    'Original Price Id',
    'Existing User Price',
    'Existing User Price Id',
    'Profiles',
    'Searches',
    'Exports',
    'Status',
    'Manage',
];

const Plans = () => {
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [planData, setPlanData] = useState<PlanEntity | null>(null);

    const { getPlans, loading, plans } = usePlans();

    useEffect(() => {
        getPlans(null).catch((err) => {
            toast.error(err.message);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manageDataHandler = (data: PlanEntity) => {
        setManageModalOpen(true);
        setPlanData(data);
    };

    return (
        <Layout>
            <PlansModal
                isOpen={manageModalOpen}
                setIsOpen={(o) => setManageModalOpen(o)}
                planData={planData}
                setPlanData={setPlanData}
            />
            <div className="p-6">
                {loading ? (
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    <table className="w-full  divide-y divide-gray-200 overflow-y-visible bg-white">
                        <thead>
                            <tr>
                                {columnHeaders.map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="min-w-fit px-6 py-3 text-left text-sm tracking-wider text-gray-600 "
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <PlansRow data={plans} columnHeaders={columnHeaders} setManageData={manageDataHandler} />
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default Plans;
