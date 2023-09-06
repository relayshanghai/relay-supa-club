import { useCompany } from 'src/hooks/use-company';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from 'src/hooks/use-user';
import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SIGNUP } from 'src/utils/rudderstack/event-names';
import { Button } from '../button';
import { ArrowRight, CheckCircleOutline, Cross, Spinner } from '../icons';
import Link from 'next/link';
import { clientLogger } from 'src/utils/logger-client';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceSteps } from 'src/hooks/use-sequence-steps';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { nextFetch } from 'src/utils/fetcher';
import type { SubscriptionCreateTrialResponse } from 'pages/api/subscriptions/create-trial-without-payment-intent';
import { createSubscriptionErrors } from 'src/errors/subscription';

const FreeTrialPage = () => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const router = useRouter();
    const { logout } = useUser();
    const { trackEvent } = useRudderstack();
    const { createDefaultSequenceSteps } = useSequenceSteps();
    const { createDefaultTemplateVariables } = useTemplateVariables();

    const [loading, setLoading] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { createSequence } = useSequence();
    const { profile } = useUser();
    const [error, setError] = useState('');

    const createDefaultSequence = async () => {
        if (!profile) {
            throw new Error('No profile found');
        }
        const defaultSequenceName = profile.first_name + "'s BoostBot Sequence";
        const newSequenceData = await createSequence(defaultSequenceName);
        if (!newSequenceData) {
            throw new Error('Failed to get sequence id');
        }
        await createDefaultSequenceSteps(newSequenceData.id);
        await createDefaultTemplateVariables(newSequenceData.id);
    };

    const startFreeTrial = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await nextFetch<SubscriptionCreateTrialResponse>(
                'subscriptions/create-trial-without-payment-intent',
                {
                    method: 'POST',
                    body: {
                        companyId: company?.id,
                        termsChecked: termsChecked,
                    },
                },
            );

            if (response.status === 'trialing' || response.status === 'active') {
                await trackEvent(SIGNUP('Start free trial success'), { company: company?.id });
                await createDefaultSequence();
                await router.push('/boostbot');
            } else {
                throw new Error(JSON.stringify(response));
            }
        } catch (error: any) {
            clientLogger(error, 'error', true); //send to Sentry
            setError(error?.message || t('signup.errorStartingTrial'));
            if (error?.message === createSubscriptionErrors.alreadySubscribed) {
                await router.push('/boostbot');
            }
            await trackEvent(SIGNUP('Start free trial failed'), { company: company?.id });
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="mb-2 pb-12 text-6xl">{t('signup.freeTrial.title')}</h1>
            <ul className="mb-4 pb-4">
                <li className="pb-3">
                    <div className="flex items-center">
                        <CheckCircleOutline className="mr-3 h-8 w-8 font-bold text-green-500" />
                        {t('signup.freeTrial.bulletPoint1')}
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <CheckCircleOutline className="mr-3 h-8 w-8 font-bold text-green-500" />
                        {t('signup.freeTrial.bulletPoint2')}
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <CheckCircleOutline className="mr-3 h-8 w-8 font-bold text-green-500" />
                        {t('signup.freeTrial.bulletPoint3')}
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <ArrowRight className="mr-3 h-8 w-8 -rotate-45 stroke-green-500 font-bold" />
                        {t('signup.freeTrial.bulletPoint4')}
                    </div>
                </li>
            </ul>
            <div className="mb-4 pt-5">
                <input
                    type="checkbox"
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
                            setShowModal(true);
                            trackEvent(SIGNUP('open Terms and Conditions'));
                        }}
                    >
                        {t('signup.freeTrial.termsAndConditionClickableText')}
                    </b>
                </label>
            </div>
            <Button
                onClick={startFreeTrial}
                disabled={loading || !termsChecked}
                className="w-full rounded border-2 px-40 py-3 text-white transition duration-300 hover:border-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
                {loading ? <Spinner className="h-5 w-full fill-primary-600" /> : t('signup.freeTrial.submitButton')}
            </Button>

            <div className="pt-20 text-center">
                {error && <p className="text-red-500">{error}</p>}
                <button type="button" className="ml-2 px-1 pb-1 pt-1 text-xs" onClick={logout}>
                    {t('login.stuckHereTryAgain1')}
                    <Link
                        className="text-primary-500"
                        href="/logout"
                        onClick={() => trackEvent(SIGNUP('Sign out from free trial page'))}
                    >
                        {t('login.signOut')}
                    </Link>
                    {t('login.stuckHereTryAgain2')}
                </button>
            </div>

            {showModal && (
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                    <div className="w-2/3 rounded-md bg-white p-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{t('signup.freeTrial.termsAndCondition.title')}</h2>
                            <button
                                className="ml-4 cursor-pointer"
                                data-test="close-button"
                                onClick={() => setShowModal(false)}
                            >
                                <Cross className="h-6 w-6 fill-gray-600 hover:cursor-pointer hover:fill-primary-500" />
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
            )}
        </div>
    );
};

export default FreeTrialPage;
