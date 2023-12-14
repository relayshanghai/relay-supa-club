import { SignUp } from '@clerk/nextjs';
import LoginSignupLayout from 'src/components/SignupLayout';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function SignUpPage() {
    return (
        <LoginSignupLayout
            leftBgColor="bg-carouselbackground"
            left={<ScreenshotsCarousel />}
            right={<SignUp path="/sign-up" routing="path" signInUrl="/sign-in" afterSignUpUrl="/create-organization" />}
        />
    );
}
