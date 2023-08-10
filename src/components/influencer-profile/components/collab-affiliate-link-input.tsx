import React from 'react';
import { TextInputComponent } from 'src/components/library/forms/text-input';

type Props = {
    //
} & (typeof TextInputComponent)['defaultProps'];

export const CollabAffiliateLinkInput = (props: Props) => {
    return (
        <>
            <TextInputComponent isRelative={false} label="Affiliate Link" {...props} />
        </>
    );
};
