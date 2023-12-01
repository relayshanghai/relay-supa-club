import type { HTMLProps } from 'react';

export type Props = HTMLProps<HTMLAnchorElement> & { active?: boolean };

export default function PageLink({ className, active, disabled, children, ...otherProps }: Props) {
    const customClassName = `${className} ${
        active ? 'font-bold underline' : 'font-medium'
    } text-primary-300 px-2 transition-all cursor-pointer`;

    if (disabled) {
        return <span className="px-2 font-medium text-tertiary-200">{children}</span>;
    }

    return (
        <a className={customClassName} {...otherProps}>
            {children}
        </a>
    );
}
