import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const OutreachNextStepsInput = (props: Props) => {
    return (
        <div className="col-span-1">
            <TextInputComponent isRelative={false} label={props.label || 'Next Step'} {...props} />
        </div>
    );
};
