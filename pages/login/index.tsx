import LoginPage from 'src/components/login-page';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';
import LoginSignupLayout from 'src/components/SignupLayout';

export default function Login() {
    return <LoginSignupLayout leftBgColor="bg-gray" left={<ScreenshotsCarousel />} right={<LoginPage />} />;
}
