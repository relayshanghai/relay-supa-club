import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCompany } from 'src/hooks/use-company';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/portal';

const CustomerPortal = () => {
    const { company } = useCompany();
    const router = useRouter();

    useEffect(() => {
        if (company?.id) {
            router.push(buildSubscriptionPortalUrl({ id: company.id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company]);

    return null;
};

export default CustomerPortal;
