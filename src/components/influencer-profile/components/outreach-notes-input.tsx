import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const OutreachNotesInput = (props: Props) => {
    return (
        <>
            <TextInputComponent isRelative={false} label="Notes" {...props} />
        </>
    );
};
