import { Button } from 'src/components/button';
import type { ButtonProps } from 'src/components/button';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { useRudderstack } from './rudderstack/rudderstack-provider';

type CreateCompanyEventParams = {
    company: string;
};

type CreateCompanyButtonProps = {
    label?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
} & ButtonProps &
    CreateCompanyEventParams;

export default function CreateCompanyButton({ children, onClick, company, ...props }: CreateCompanyButtonProps) {
    const rudderstack = useRudderstack();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            rudderstack?.track('Clicked on Create Company', { company });
            onClick(event);
        },
        [onClick, rudderstack, company],
    );

    return (
        <Button type="button" {...props} onClick={handleClick}>
            {props.label || children || 'Create Company'}
        </Button>
    );
}
