import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const ShippingDetailsPhoneNumberInput = (props: Props) => {
    return (
        <>
            <TextInputComponent label="Phone Number" {...props} />
        </>
    );
};
