import { LegacyLoginSignupLayout } from 'src/components/LegacySignupLayout';
import LoginPage from 'src/components/login-page';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';
import LoginSignupLayout from 'src/components/SignupLayout';

export default function Login() {
    const loginV2 = true;

    return (
        <>
            {loginV2 ? (
                <LoginSignupLayout left={<ScreenshotsCarousel />} right={<LoginPage />} />
            ) : (
                <LegacyLoginSignupLayout>
                    <LoginPage />
                </LegacyLoginSignupLayout>
            )}
        </>
    );
}
