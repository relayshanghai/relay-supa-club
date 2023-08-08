import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const CollabScheduledPostDateInput = (props: Props) => {
    return (
        <>
            <TextInputComponent label="Scheduled Post Date" {...props} />
        </>
    );
};
