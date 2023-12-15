import { CreateOrganization } from '@clerk/nextjs';
import LoginSignupLayout from 'src/components/SignupLayout';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function CreateOrganizationPage() {
    return (
        <LoginSignupLayout
            leftBgColor="boostbot-gradient"
            left={<ScreenshotsCarousel />}
            right={<CreateOrganization routing="path" path="/create-org" afterCreateOrganizationUrl="/boostbot" />}
        />
    );
}
