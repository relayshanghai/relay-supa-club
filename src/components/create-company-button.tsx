import { Button } from 'src/components/button';
import type { ButtonProps } from 'src/components/button';
import type { PropsWithChildren } from 'react';
import type { RudderEvent } from './with-tracking';
import { WithClickTracking } from './with-tracking';

export type CreateCompanyEventParams = {
    company: string;
};

export const CreateCompanyEvent: RudderEvent = (rudder) => (properties: CreateCompanyEventParams) => {
    rudder.trackEvent('Clicked on Create Company', properties);
};

const CreateCompanyButton = ({ children, ...props }: PropsWithChildren<ButtonProps>) => (
    <Button type="button" {...props}>
        {children}
    </Button>
);

export default WithClickTracking(CreateCompanyButton);
