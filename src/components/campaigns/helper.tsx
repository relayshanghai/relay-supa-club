import type { LabelValueObject } from 'types';

export type Question = {
    type: string;
    fieldName: string;
    isRequired: boolean;
    title: string;
    desc: string;
    options?: LabelValueObject[];
    placeholder?: string;
};

export const questions: Question[] = [
    {
        type: 'textInput',
        fieldName: 'name',
        isRequired: true,
        title: 'campaigns.form.nameQuestion',
        desc: 'campaigns.form.nameDescription',
    },

    {
        fieldName: 'media_gallery',
        type: 'media',
        title: 'campaigns.form.mediaGalleryQuestion',
        desc: 'campaigns.form.mediaGalleryDescription',
        isRequired: false,
    },
];
