import type { ButtonProps } from 'src/components/button';
import { Button } from 'src/components/button';

export type Props = ButtonProps & {
    active?: boolean;
    className?: string;
    children: string | number;
    disabled?: boolean;
};

export default function PageLink({ className, active, children, ...otherProps }: Props) {
    return (
        <Button
            variant="neutral"
            data-testid={`pagination-link-${children}`}
            className={`${className} ${
                active ? 'font-bold underline' : 'font-medium'
            } !px-2 text-primary-300 transition-all`}
            {...otherProps}
        >
            {children}
        </Button>
    );
}
