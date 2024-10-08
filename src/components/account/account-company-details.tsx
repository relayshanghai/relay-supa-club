import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { updateCompanyErrors } from 'src/errors/company';
import { useFields } from 'src/hooks/use-fields';
import { isAdmin } from 'src/utils/utils';
import { hasCustomError } from 'src/utils/errors';
import { Button } from 'shadcn/components/ui/button';
import { Input } from '../input';
import { useCompany } from 'src/hooks/use-company';
import { useUser } from 'src/hooks/use-user';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { UpdateProfileInfo } from 'src/utils/analytics/events';
import Label from './label';

export const CompanyDetails = () => {
    const { company, updateCompany, refreshCompany } = useCompany();
    const { loading: userDataLoading, profile } = useUser();

    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValues,
        reset: resetCompanyValues,
    } = useFields<{ name: string; website: string }>({
        name: '',
        website: '',
    });
    const [updating, setUpdating] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (company) {
            resetCompanyValues({ name: company.name || '', website: company.website || '' });
        }
        refreshCompany();
    }, [company, resetCompanyValues, refreshCompany]);

    const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    const handleUpdateCompany = async () => {
        try {
            setUpdating(true);
            const oldCompanyName = company?.name;
            const oldCompanyWebsite = company?.website;
            await updateCompany({
                name: companyValues.name,
                website: companyValues.website,
            });
            toast.success(t('account.company.companyProfileUpdated'));
            if (companyValues.name !== oldCompanyName) {
                track(UpdateProfileInfo, {
                    info_type: 'Company',
                    info_name: 'Name',
                });
            }
            if (companyValues.website !== oldCompanyWebsite) {
                track(UpdateProfileInfo, {
                    info_type: 'Company',
                    info_name: 'Website',
                });
            }
        } catch (e: any) {
            if (hasCustomError(e, updateCompanyErrors)) {
                // right now we only have the companyWithSameNameExists error that's also used in login
                toast.error(t(`login.${e.message}`));
            } else {
                toast.error(t('account.company.oopsWentWrong'));
            }
        } finally {
            setUpdating(false);
        }
    };

    return (
        <section id="company-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.companyInfoSection.title')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end" id="account-subaccount">
                <div className="relative flex flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:w-3/4">
                    {isAdmin(profile?.user_role) ? (
                        <>
                            <div className="w-full">
                                <Input
                                    label={t('account.company.companyName')}
                                    type="text"
                                    value={companyValues.name || ''}
                                    required
                                    onChange={(e) => {
                                        setCompanyFieldValues('name', e.target.value);
                                        if (e.target.value === company?.name || e.target.value === '') {
                                            setButtonDisabled(true);
                                            return;
                                        }
                                        setButtonDisabled(false);
                                    }}
                                />
                                <Input
                                    label={t('account.company.website')}
                                    type="text"
                                    value={companyValues.website || ''}
                                    placeholder={t('account.company.websiteAddress') || ''}
                                    required
                                    onChange={(e) => {
                                        setCompanyFieldValues('website', e.target.value);
                                        if (e.target.value === company?.website || e.target.value === '') {
                                            setButtonDisabled(true);
                                            return;
                                        }
                                        setButtonDisabled(false);
                                    }}
                                />
                            </div>
                            <div className="flex w-full flex-row justify-end space-x-4">
                                {(companyValues.name !== company?.name ||
                                    companyValues.website !== company?.website) && (
                                    <Button
                                        disabled={userDataLoading || updating}
                                        className="border-primary-500 bg-white font-semibold text-primary-500 hover:bg-primary-500 disabled:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
                                        variant="outline"
                                        onClick={() => {
                                            resetCompanyValues({
                                                name: company?.name || '',
                                                website: company?.website || '',
                                            });
                                            setButtonDisabled(true);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    className='hover:bg-navy-100" bg-navy-50 font-semibold text-navy-500 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:cursor-not-allowed  disabled:hover:border-gray-500 disabled:hover:bg-gray-100 disabled:hover:text-gray-500'
                                    disabled={userDataLoading || updating || buttonDisabled}
                                    onClick={handleUpdateCompany}
                                >
                                    Update company info
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex w-full flex-col gap-5">
                            <Label label={t('account.company.companyName')} value={companyValues.name || ''} />
                            <Label label={t('account.company.website')} value={companyValues.website || ''} />
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};
