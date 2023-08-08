import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const ShippingDetailsPostalCodeInput = (props: Props) => {
    return (
        <>
            <TextInputComponent label="Postal Code" {...props} />
        </>
    );
};
