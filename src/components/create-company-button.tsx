import { Button } from 'src/components/button';
import type { ButtonProps } from 'src/components/button';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { useRudderstack } from 'src/hooks/use-rudderstack';

type CreateCompanyEventParams = {
    company: string;
};

type CreateCompanyButtonProps = {
    label?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
} & ButtonProps &
    CreateCompanyEventParams;

export default function CreateCompanyButton({ children, onClick, company, ...props }: CreateCompanyButtonProps) {
    const { trackEvent } = useRudderstack();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            trackEvent('Clicked on Create Company', { company });
            onClick(event);
        },
        [onClick, trackEvent, company],
    );

    return (
        <Button type="button" {...props} onClick={handleClick}>
            {props.label || children || 'Create Company'}
        </Button>
    );
}
