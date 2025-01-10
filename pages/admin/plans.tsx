import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PlansModal } from 'src/components/admin/PlansModal';
import { PlansRow } from 'src/components/admin/PlansRow';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { usePlans } from 'src/hooks/use-plans';
import { type PlanSummary } from 'types/plans';

const columnHeaders = [
    'Item Name',
    'Price Type',
    'Billing Period',
    'Profiles',
    'Searches',
    'Exports',
    'Status',
    'Manage',
];

const Plans = () => {
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const { getPlanSummaries, loading, planSummaries, planData, setPlanData } = usePlans();

    useEffect(() => {
        getPlanSummaries().catch((err) => {
            toast.error(err.message);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manageDataHandler = (data: PlanSummary) => {
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
                    <div>
                        <Button className="mb-4" onClick={() => setManageModalOpen(true)}>
                            Add Plan
                        </Button>
                        <table className="w-full divide-y divide-gray-200 overflow-y-visible bg-white">
                            <thead>
                                <tr>
                                    {columnHeaders.map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="min-w-fit px-6 py-3 text-left text-sm tracking-wider text-gray-600"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <PlansRow
                                data={planSummaries}
                                columnHeaders={columnHeaders}
                                setManageData={manageDataHandler}
                            />
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Plans;
