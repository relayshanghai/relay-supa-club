import type { HTMLProps } from 'react';

export type Props = HTMLProps<HTMLAnchorElement> & { active?: boolean };

export default function PageLink({ className, active, disabled, children, ...otherProps }: Props) {
    const customClassName = `${className} ${
        active ? 'font-bold underline' : 'font-medium'
    } text-primary-300 mx-2 transition-all cursor-pointer`;

    if (disabled) {
        return <span className="mx-3 font-medium text-tertiary-200">{children}</span>;
    }

    return (
        <a className={customClassName} {...otherProps}>
            {children}
        </a>
    );
}
