import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAdmin } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { Input } from '../input';
import { useUser } from 'src/hooks/use-user';
import { emailRegex } from 'src/constants';
import toast from 'react-hot-toast';
import Label from './label';
import { useSubscription } from 'src/hooks/v2/use-subscription';

export const BillingDetails = () => {
    const { customer, updateDefaultInvoiceEmail } = useSubscription();

    const { profile } = useUser();

    const [buttonDisabled, setButtonDisabled] = useState(true);

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
            <p className="pb-6 font-semibold">Billing Info</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <div className="relative flex flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:w-3/4">
                    {isAdmin(profile?.user_role) ? (
                        <>
                            <div className="w-full">
                                <Input
                                    label="Invoice receiving email"
                                    disabled={updating}
                                    type="email"
                                    value={invoiceEmailText || ''}
                                    required
                                    onChange={(e) => {
                                        setInvoiceEmailText(e.target.value);
                                        if (e.target.value === customer?.email || e.target.value === '') {
                                            setButtonDisabled(true);
                                            return;
                                        }
                                        if (!emailRegex.test(e.target.value)) {
                                            setButtonDisabled(true);
                                            setError(true);
                                            return;
                                        }
                                        setError(false);
                                        setButtonDisabled(false);
                                        return;
                                    }}
                                />
                            </div>
                            <div className="flex w-full flex-row justify-end space-x-4">
                                {invoiceEmailText !== customer?.email && (
                                    <Button
                                        disabled={updating}
                                        className="border-primary-500 bg-white font-semibold text-primary-500 hover:bg-primary-500"
                                        variant="outline"
                                        onClick={() => {
                                            setInvoiceEmailText(customer?.email || '');
                                            setButtonDisabled(true);
                                            setError(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    className='hover:bg-navy-100" bg-navy-50 font-semibold text-navy-500'
                                    disabled={updating || error || buttonDisabled}
                                    onClick={handleUpdateInvoiceEmail}
                                >
                                    Update billing info
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
