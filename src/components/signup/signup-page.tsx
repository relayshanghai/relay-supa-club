import { useTranslation } from 'react-i18next';
import { FormWizard } from './signup-wizard';
// import { useState } from 'react';
import { Input } from '../input';

const SignUpPage = () => {
    const { t } = useTranslation();
    // const [currentStep, setCurrentStep] = useState(1);
    const currentStep = 1;

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
                        <FormWizard title={step.title} key={step.num}>
                            <Input label="First Name" type="text" placeholder="First" value="" />
                            <Input label="Last Name" type="text" placeholder="Last" value="" />
                            <Input label="Phone" type="text" placeholder="+1 (000) 000-0000" value="" />
                        </FormWizard>
                    ),
            )}
        </div>
    );
};

export default SignUpPage;
