import { SignIn } from '@clerk/nextjs';
import LoginSignupLayout from 'src/components/SignupLayout';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function SignInPage() {
    return (
        <LoginSignupLayout
            leftBgColor="boostbot-gradient"
            left={<ScreenshotsCarousel />}
            right={<SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" afterSignInUrl="/boostbot" />}
        />
    );
}
