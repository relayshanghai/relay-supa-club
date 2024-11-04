import type { ReactNode } from 'react';
import { LanguageToggle } from './common/language-toggle';
import { Title } from './title';

interface LayoutProps {
    left: ReactNode;
    right: ReactNode;
    leftBgColor?: string;
    outterBoxClassNames?: string;
    leftInnerBoxClassNames?: string;
    rightInnerBoxClassNames?: string;
    languageToggleBoxClassNames?: string;
}

export const LoginSignupLayout = (props: LayoutProps) => {
    return (
        <div className={`flex h-screen overflow-auto ${props.outterBoxClassNames ? props.outterBoxClassNames : ''}`}>
            <div
                className={`flex h-full w-0 items-center justify-center overflow-auto ${props.leftBgColor} md:w-1/2  ${
                    props.leftInnerBoxClassNames ? props.leftInnerBoxClassNames : ''
                }`}
            >
                {props.left}
            </div>
            <div
                className={`flex h-full w-full flex-col overflow-auto md:w-1/2 ${
                    props.rightInnerBoxClassNames ? props.rightInnerBoxClassNames : ''
                }`}
            >
                <div
                    className={`mb-20 flex items-center justify-between p-5 ${
                        props.languageToggleBoxClassNames ? props.languageToggleBoxClassNames : ''
                    }`}
                >
                    <Title />
                    <LanguageToggle />
                </div>
                <div className="flex flex-col items-center justify-center">{props.right}</div>
            </div>
        </div>
    );
};

export default LoginSignupLayout;
