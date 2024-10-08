import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const CollabFeeInput = (props: Props) => {
    return (
        <>
            <TextInputComponent isRelative={false} label="Fee (USD)" type="number" {...props} />
        </>
    );
};
