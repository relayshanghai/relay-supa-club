import SignUpPage from 'src/components/signup/signup-page';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function Register() {
    return (
        <LoginSignupLayout leftBgColor="bg-carouselbackground" left={<ScreenshotsCarousel />} right={<SignUpPage />} />
    );
}
