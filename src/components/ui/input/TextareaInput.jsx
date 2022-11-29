import { useTranslation } from "react-i18next";

function TextArea ({ fieldName, label, type, register, errors, placeHolder, isRequired, maxLength, minLength }) {
  const { t } = useTranslation();

	return (
  <div>
    <label className="text-xs font-semibold text-gray-600" htmlFor={fieldName} >{label}</label>
    <textarea className="textarea-field" cols="30" rows="5" name={fieldName} id={fieldName} placeholder={placeHolder} type={type} {...register(fieldName, {
    required: {value: isRequired, message: t('website.requiredField')},
    maxLength: { value: maxLength, message: `${t('website.maxLength')} ${maxLength} ${t('website.characters')}`},
    minLength: {value: minLength, message: `${t('website.minLength')} ${minLength} ${t('website.characters')}`}
    })} />
    <p className="text-xs text-primary-400">{ errors[fieldName] && errors[fieldName].message }</p>
  </div>

 )
}

export default TextArea;
