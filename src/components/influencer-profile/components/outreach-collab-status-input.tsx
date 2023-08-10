import type { ComponentProps } from 'react';
import React from 'react';
import { CheckboxDropdown } from './checkbox-dropdown';

type Props = {
    //
} & Omit<ComponentProps<typeof CheckboxDropdown>, 'label'> & { label?: string };

export const OutreachCollabStatusInput = (props: Props) => {
    return (
        <>
            <CheckboxDropdown {...props} label="Status" options={props.options} selected={props.selected} />
        </>
    );
};
