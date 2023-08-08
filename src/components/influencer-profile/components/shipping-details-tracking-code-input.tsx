import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const ShippingDetailsTrackingCodeInput = (props: Props) => {
    return (
        <>
            <TextInputComponent label="Tracking Code" {...props} />
        </>
    );
};
