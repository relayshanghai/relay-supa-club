import type { ComponentProps } from 'react';
import React from 'react';
import { CheckboxDropdown } from './checkbox-dropdown';

type Props = {
    //
} & Omit<ComponentProps<typeof CheckboxDropdown>, 'label'> & { label?: string };

export const OutreachCollabStatusInput = (props: Props) => {
    return (
        <div className="col-span-1 w-full">
            <CheckboxDropdown
                {...props}
                multiple={false}
                label={props.label || 'Collab Status'}
                options={props.options}
                selected={props.selected}
            />
        </div>
    );
};
