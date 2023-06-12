import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormWizard } from './form-wizard';
import { Input } from '../input';
import { SingleSelect } from '../ui';
import { companyCategories } from './company-categories';

const SignUpPage = () => {
    const { t } = useTranslation();
    const {
        control,
        setValue,
        formState: { errors },
    } = useForm();

    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        {
            title: t('signup.step1title'),
            num: 1,
        },
        {
            title: t('signup.step2title'),
            num: 2,
        },
        {
            title: t('signup.step3title'),
            num: 3,
        },
        {
            title: t('signup.step4title'),
            num: 4,
        },
        {
            title: t('signup.step5title'),
            num: 5,
        },
    ];

    return (
        <div>
            {steps.map(
                (step) =>
                    step.num === currentStep && (
                        <FormWizard
                            title={step.title}
                            key={step.num}
                            steps={steps}
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                        >
                            {currentStep === 1 && (
                                <>
                                    <Input label={t('signup.firstName')} type="text" placeholder="First" value="" />
                                    <Input label={t('signup.lastName')} type="text" placeholder="Last" value="" />
                                    <Input
                                        label={t('signup.phoneNumber')}
                                        type="text"
                                        placeholder="+1 (000) 000-0000"
                                        value=""
                                    />
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <Input label={t('signup.email')} type="email" placeholder="you@site.com" value="" />
                                    <Input
                                        label={t('signup.password')}
                                        type="password"
                                        placeholder="password"
                                        value=""
                                    />
                                    <Input
                                        label={t('signup.confirmPassword')}
                                        type="password"
                                        placeholder="password"
                                        value=""
                                    />
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <SingleSelect
                                        fieldName="company_category"
                                        errors={errors}
                                        isRequired
                                        control={control}
                                        options={companyCategories}
                                        defaultValue=""
                                        setValue={setValue}
                                        className=""
                                    />
                                </>
                            )}

                            {currentStep === 4 && (
                                <>
                                    <Input label={t('signup.company')} type="text" placeholder="Company" value="" />
                                    <Input
                                        label={t('signup.website')}
                                        type="text"
                                        placeholder="www.site.com"
                                        value=""
                                    />
                                </>
                            )}
                            {/* TODO:Task for later PR: Link with stripe payment component */}
                            {currentStep === 5 && (
                                <>
                                    <p>Placeholder to link the stripe payment elements</p>
                                </>
                            )}
                        </FormWizard>
                    ),
            )}
        </div>
    );
};

export default SignUpPage;
