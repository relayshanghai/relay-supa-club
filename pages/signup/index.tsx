import { useState } from 'react';
import SignUpPage from 'src/components/signup/signup-page';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { STRIPE_PRICE_MONTHLY_DIY } from 'src/utils/api/stripe/constants';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function Register() {
    const [selectedPriceId] = useState(STRIPE_PRICE_MONTHLY_DIY);

    return (
        <LoginSignupLayout
            leftBgColor="bg-carouselbackground"
            left={<ScreenshotsCarousel />}
            right={<SignUpPage selectedPriceId={selectedPriceId} />}
        />
    );
}
