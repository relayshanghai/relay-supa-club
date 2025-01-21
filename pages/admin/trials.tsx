import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { TrialsRow } from 'src/components/admin/TrialsRow';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { useTrialCustomers } from 'src/hooks/use-trial-customer';

const columnHeaders = ['Customer ID', 'Full Name', 'Phone Number', 'Email', 'Company Name'];

const TrialCustomers = () => {
    const { getTrialCustomers, trialCustomers, loading } = useTrialCustomers();
    useEffect(() => {
        getTrialCustomers().catch(() => toast.error('Failed to fetch trial customers'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Layout>
            {loading ? (
                <Spinner className="h-5 w-5 fill-primary-600 text-white" />
            ) : (
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
                    <TrialsRow data={trialCustomers} columnHeaders={columnHeaders} />
                </table>
            )}
        </Layout>
    );
};

export default TrialCustomers;
