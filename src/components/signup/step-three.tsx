import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import type { SignUpValidationErrors } from './signup-page';
import { Spinner } from '../icons';
import { useCallback, useRef, useState } from 'react';
import { useCompany } from 'src/hooks/use-company';
import { clientLogger } from 'src/utils/logger-client';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SIGNUP } from 'src/utils/rudderstack/event-names';

const TermsModal = ({ setShowModal }: { setShowModal: (show: boolean) => void }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 rounded-md bg-white p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{t('signup.freeTrial.termsAndCondition.title')}</h2>
                    <button
                        data-test="close-button"
                        className="ml-4 cursor-pointer"
                        onClick={() => setShowModal(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 28 28"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                stroke-linejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </button>
                </div>
                <ul className="mb-4 mt-4 pb-4">
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point1Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point1Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point2Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point2Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point3Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point3Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point4Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point4Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point5Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point5Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point6Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point6Description')}
                            </div>
                        </div>
                    </li>
                    <li className="pb-3">
                        <div className="flex items-center">
                            <div>
                                <b>{t('signup.freeTrial.termsAndCondition.point7Title')}</b>
                                <br />
                                {t('signup.freeTrial.termsAndCondition.point7Description')}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export const StepThree = ({
    companyName,
    companyWebsite,
    setAndValidate,
    validationErrors,
    loading,
    onNext,
}: {
    companyName: string;
    companyWebsite: string;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    validationErrors: SignUpValidationErrors;
    loading: boolean;
    onNext: any;
}) => {
    const { t } = useTranslation();
    const { companyExists } = useCompany();
    const { trackEvent } = useRudderstack();

    const [companyError, setCompanyError] = useState(false);
    const [inputLoading, setInputLoading] = useState(false);

    const invalidFormInput =
        isMissing(companyName) || validationErrors.companyName !== '' || validationErrors.companyWebsite !== '';
    const submitDisabled = invalidFormInput || loading;
    const websiteRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);

    const [existsTimeout, setExistsTimeout] = useState<NodeJS.Timeout | undefined>();
    const [existingOwnerEmail, setExistingOwnerEmail] = useState<string | undefined>();

    const setCompanyExists = useCallback(
        async (name: string) => {
            if (existsTimeout) {
                clearTimeout(existsTimeout);
            }
            setExistsTimeout(
                setTimeout(async () => {
                    try {
                        const res = await companyExists(name);
                        if (res?.exists) {
                            res?.mail && setExistingOwnerEmail(res.mail);
                            setCompanyError(true);
                        } else {
                            setCompanyError(false);
                        }
                    } catch (error: any) {
                        clientLogger(error);
                    }

                    setInputLoading(false);
                }, 1000),
            );
        },
        [existsTimeout, companyExists],
    );

    const [termsChecked, setTermsChecked] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    return (
        <>
            <Input
                label={t('signup.company')}
                value={companyName}
                error={
                    companyError ? t('signup.errorCompanyExists', { companyOwnerEmail: existingOwnerEmail }) : undefined
                }
                loading={inputLoading}
                placeholder={t('signup.companyPlaceholder')}
                required
                onChange={async (e) => {
                    setCompanyError(false);
                    setExistingOwnerEmail(undefined);
                    setAndValidate('companyName', e.target.value);
                    setInputLoading(true);
                    setCompanyExists(e.target.value);
                }}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        websiteRef?.current?.focus();
                    }
                }}
            />
            <Input
                label={t('signup.website')}
                value={companyWebsite}
                placeholder="www.site.com"
                onChange={(e) => setAndValidate('companyWebsite', e.target.value)}
                ref={websiteRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        termsRef?.current?.focus();
                    }
                }}
            />
            <input
                ref={termsRef}
                type="checkbox"
                className="text-primary-600"
                checked={termsChecked}
                onChange={() => {
                    setTermsChecked(!termsChecked);
                    trackEvent(SIGNUP('check Terms and Conditions'), { termsChecked: !termsChecked });
                }}
                id="terms"
            />
            <label htmlFor="terms" className="ml-2">
                {t('signup.freeTrial.termsAndConditionCheckboxLabel')}
                <b
                    className="cursor-pointer"
                    onClick={() => {
                        setShowTermsModal(true);
                        trackEvent(SIGNUP('open Terms and Conditions'));
                    }}
                >
                    {t('signup.freeTrial.termsAndConditionClickableText')}
                </b>
            </label>

            <Button
                disabled={submitDisabled || companyError || inputLoading || !termsChecked}
                type="submit"
                className="mt-12 flex w-full justify-center"
                onClick={onNext}
            >
                {loading ? <Spinner className="h-5 w-5 fill-primary-600" /> : t('signup.next')}
            </Button>
            <div> {showTermsModal && <TermsModal setShowModal={setShowTermsModal} />}</div>
        </>
    );
};
