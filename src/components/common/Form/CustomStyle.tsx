//Custom style for React Select, using tailwind config color
//TODO: find a way to use the tailwind terms

import type { StylesConfig, GroupBase } from 'react-select';

const CustomStyles: StylesConfig<any, true, GroupBase<any>> = {
    menuList: (base) => ({
        ...base,
        fontSize: '1rem',
        color: '#4b5563',
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '0.875rem',
        backgroundColor: state.isFocused ? '#E9E8FC' : 'white',
        color: state.isSelected ? '#8B5CF6' : '#4b5563',
    }),
    control: (provided) => ({
        ...provided,
        borderColor: '#e5e7eb',
        borderRadius: '0.375rem',
        minHeight: '36px',
        // height: '36px',
        ':hover': {
            borderColor: '#8B5CF6',
        },
        fontSize: '0.875rem',
        color: '#4b5563',
        outline: 'none',
        boxShadow: 'none',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 0.375rem',
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        fontSize: '0.75rem',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        backgroundColor: '#E9E8FC',
        color: '#8B5CF6',
        fontSize: '0.75rem',
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: '#8B5CF6',
        backgroundColor: '#E9E8FC',
        ':hover': {
            backgroundColor: '#DDD6FE',
            color: '#6D28D9',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: '0.75rem',
    }),
    input: (provided) => ({
        ...provided,
        color: '#4b5563',
        fontSize: '1rem',
        borderRadius: '0.375rem',
    }),
};

export default CustomStyles;
