import type { ReactNode } from 'react';
import { LanguageToggle } from './common/language-toggle';
import { Title } from './title';

interface LayoutProps {
    left: ReactNode;
    right: ReactNode;
}

export const LoginSignupLayout = (props: LayoutProps) => {
    return (
        <div className="flex h-screen">
            <div className=" flex h-full w-0 items-center justify-center bg-primary-500 md:w-1/2">{props.left}</div>
            <div className="flex h-full w-full flex-col md:w-1/2">
                <div className="mb-20 flex items-center justify-between p-5">
                    <Title />
                    <LanguageToggle />
                </div>
                <div className="flex flex-col items-center justify-center">{props.right}</div>
            </div>
        </div>
    );
};

export default LoginSignupLayout;
