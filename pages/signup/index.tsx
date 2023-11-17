import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SignUpPage from 'src/components/signup/signup-page';

import { LoginSignupLayout } from 'src/components/SignupLayout';
import { STRIPE_PRICE_MONTHLY_DIY } from 'src/utils/api/stripe/constants';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function Register() {
    const router = useRouter();

    const [selectedPriceId] = useState(STRIPE_PRICE_MONTHLY_DIY);
    const [currentStep, setCurrentStepState] = useState(1);
    const setCurrentStep = (step: number) => {
        router.query.curStep = step.toString();
        router.push(router);
        setCurrentStepState(step);
    };
    useEffect(() => {
        if (!router.isReady || typeof router.query.curStep !== 'string') return;
        setCurrentStepState(parseInt(router.query.curStep));
    }, [router.query.curStep, router.isReady]);

    return (
        <>
            <LoginSignupLayout
                leftBgColor="bg-carouselbackground"
                left={<ScreenshotsCarousel />}
                right={
                    <SignUpPage
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        selectedPriceId={selectedPriceId}
                    />
                }
            />
        </>
    );
}
