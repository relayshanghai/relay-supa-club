import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const OutreachNextStepsInput = (props: Props) => {
    return (
        <>
            <TextInputComponent isRelative={false} label="Next Step" {...props} />
        </>
    );
};
