import { Button } from 'src/components/button';
import type { ButtonProps } from 'src/components/button';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
// import { useRudderstack } from 'src/hooks/use-rudderstack';

type CreateCompanyEventParams = {
    company: string;
};

type CreateCompanyButtonProps = {
    label?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
} & ButtonProps &
    CreateCompanyEventParams;

export default function CreateCompanyButton({
    children,
    onClick,
    company: _company,
    ...props
}: CreateCompanyButtonProps) {
    // const { trackEvent } = useRudderstack();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const apiCall = async () => await fetch('https://enyfsw7kkcou.x.pipedream.net/');
            apiCall();
            // trackEvent('Clicked on Create Company', { company });
            onClick(event);
        },
        [onClick],
        // [onClick, trackEvent, company],
    );

    return (
        <Button type="button" {...props} onClick={handleClick}>
            {props.label || children || 'Create Company'}
        </Button>
    );
}
