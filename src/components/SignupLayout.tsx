import { PropsWithChildren } from 'react';
import { CompanyProvider } from 'src/hooks/use-company';
import { LanguageToggle } from './common/language-toggle';
import { Title } from './title';

export const LoginSignupLayout = ({ children }: PropsWithChildren) => (
    <div className="flex h-screen w-full flex-col px-10">
        <div className="sticky top-0 flex w-full items-center justify-between">
            <Title />
            <LanguageToggle />
        </div>
        {children}
    </div>
);

/** Same as LoginSignupLayout but with company context */
export const OnboardLayout = ({ children }: PropsWithChildren) => (
    <CompanyProvider>
        <LoginSignupLayout>{children}</LoginSignupLayout>
    </CompanyProvider>
);
