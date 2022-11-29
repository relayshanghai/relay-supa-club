import { useTranslation } from "react-i18next";

function TextInput ({fieldName, label, type, register, errors, placeHolder, isRequired, maximLength, minimLength}) {
  const { t } = useTranslation();

	return (
  <div>
    <label className="text-xs font-semibold text-gray-600" htmlFor={fieldName} >{label}</label>
    <input className="input-field" name={fieldName} id={fieldName} placeholder={placeHolder} type={type} {...register(fieldName, {
    required: {value: isRequired, message: t('website.requiredField')},
    maxLength: {value: maximLength, message: `${t('website.maxLength')} ${maximLength} ${t('website.characters')}`},
    minLength: {value: minimLength, message: `${t('website.minLength')} ${minimLength} ${t('website.characters')}`}
    })} />
    <p className="text-xs text-primary-400">{ errors[fieldName] && errors[fieldName].message}</p>
  </div>

 )
}

export default TextInput;

// pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address'}
