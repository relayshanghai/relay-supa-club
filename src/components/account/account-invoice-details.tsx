import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAdmin } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { Input } from '../input';
import { useUser } from 'src/hooks/use-user';
import { emailRegex } from 'src/constants';
import toast from 'react-hot-toast';
import Label from './label';
import { useSubscriptionV2 } from 'src/hooks/use-subscription-v2';

export const InvoiceDetails = () => {
    const { customer, updateDefaultInvoiceEmail } = useSubscriptionV2();

    const { profile } = useUser();

    const { t } = useTranslation();
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [invoiceEmailText, setInvoiceEmailText] = useState<string>('');

    useEffect(() => {
        setInvoiceEmailText(customer?.email || '');
    }, [customer?.email]);

    const handleUpdateInvoiceEmail = useCallback(async () => {
        if (!customer?.email) {
            return;
        }
        if (invoiceEmailText === customer?.email) {
            return;
        }
        setUpdating(true);
        try {
            await updateDefaultInvoiceEmail(invoiceEmailText);
            toast.success(t('account.invoiceEmailUpdated'));
        } catch (error: any) {
            setError(true);
            toast.error(t(error.message ?? 'account.error'));
        } finally {
            setUpdating(false);
        }
    }, [customer?.email, invoiceEmailText, updateDefaultInvoiceEmail, t]);

    return (
        <section id="company-details" className="w-full">
            <p className="pb-6 font-semibold">Invoice Info</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <div className="relative flex flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:w-3/4">
                    {isAdmin(profile?.user_role) ? (
                        <>
                            <div className="w-full">
                                <Input
                                    label="Invoice Email"
                                    type="email"
                                    value={invoiceEmailText || ''}
                                    required
                                    onChange={(e) => {
                                        if (!emailRegex.test(e.target.value)) {
                                            setError(true);
                                        } else {
                                            setError(false);
                                        }
                                        setInvoiceEmailText(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex w-full flex-row justify-end space-x-4">
                                <Button
                                    className='hover:bg-blue-300" bg-blue-200 font-semibold text-blue-500'
                                    disabled={updating || error}
                                    onClick={handleUpdateInvoiceEmail}
                                >
                                    {t('account.update')}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Label label="Invoice Email" value={customer?.email || ''} />
                    )}
                </div>
            </section>
        </section>
    );
};
