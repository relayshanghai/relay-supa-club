import type { ReactNode } from 'react';
import { LanguageToggle } from './common/language-toggle';
import { Title } from './title';

interface LayoutProps {
    left: ReactNode;
    right: ReactNode;
}

export const LoginSignupLayout = (props: LayoutProps) => {
    return (
        <div className="container flex h-screen">
            <div className=" invisible bg-primary-500 md:visible md:flex-1">{props.left}</div>
            <div className="flex flex-1 flex-col">
                <div className="mb-20 flex items-center justify-between">
                    <Title />
                    <LanguageToggle />
                </div>
                <div>{props.right}</div>
            </div>
        </div>
    );
};

export default LoginSignupLayout;
