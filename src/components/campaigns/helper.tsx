import { countryList } from './countryList';
import options from './options';

export const typePromotions = [
    { label: 'campaigns.form.dedicatedVideo', value: 'Dedicated Video' },
    { label: 'campaigns.form.integratedVideo', value: 'Integrated Video' }
];

export const currencyOptions = [
    { label: 'USD', value: 'USD' },
    { label: 'CNY', value: 'CNY' }
];

export const countryListMap = countryList.map((c) => {
    return {
        label: c.name,
        value: c.name
    };
});

export const questions = [
    {
        type: 'textInput',
        fieldName: 'name',
        isRequired: true,
        title: 'campaigns.form.nameQuestion',
        desc: 'campaigns.form.nameDescription'
    },
    {
        type: 'textArea',
        fieldName: 'description',
        isRequired: true,
        title: 'campaigns.form.descriptionQuestion',
        desc: 'campaigns.form.descriptionDescription'
    },
    {
        type: 'textInput',
        fieldName: 'product_name',
        isRequired: true,
        title: 'campaigns.form.productNameQuestion',
        desc: 'campaigns.form.productNameDescription'
    },
    {
        type: 'textInput',
        fieldName: 'product_link',
        isRequired: false,
        title: 'campaigns.form.productLinkQuestion',
        desc: 'campaigns.form.productLinkDescription'
    },
    {
        type: 'media',
        title: 'campaigns.form.mediaGalleryQuestion',
        desc: 'campaigns.form.mediaGalleryDescription'
    },
    {
        type: 'multiSelect',
        fieldName: 'tag_list',
        isRequired: true,
        options: options,
        placeholder: 'campaigns.form.tagsPlaceholder',
        title: 'campaigns.form.tagsQuestion',
        desc: 'campaigns.form.tagsDescription'
    },
    {
        type: 'multiSelect',
        fieldName: 'target_locations',
        isRequired: true,
        options: countryListMap,
        placeholder: 'campaigns.form.targetPlaceholder',
        title: 'campaigns.form.targetQuestion',
        desc: 'campaigns.form.targetDescription'
    },
    {
        type: 'currencyInput',
        fieldName: 'budget_currency',
        isRequired: true,
        title: 'campaigns.form.budgetQuestion',
        desc: 'campaigns.form.budgetDescription'
    },
    {
        type: 'timeline',
        fieldName_start: 'date_start_campaign',
        fieldName_end: 'date_end_campaign',
        label_start: 'campaigns.form.startDate',
        label_end: 'campaigns.form.endDate',
        isRequired: false,
        title: 'campaigns.form.timelineQuestion',
        desc: 'campaigns.form.timelineDescription'
    },
    {
        type: 'checkbox',
        fieldName: 'promo_types',
        isRequired: true,
        options: typePromotions,
        title: 'campaigns.form.promotionQuestion',
        desc: 'campaigns.form.promotionDescription'
    }
];
