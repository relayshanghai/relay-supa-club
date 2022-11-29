import { useTranslation } from "react-i18next";

function Checkbox ({fieldName, register, errors, options, isRequired}) {
  const { t } = useTranslation();

	return (
  <div>
    { options.map((type, index) => {
      return (
        <div key={index} className="flex items-center mb-1">
          <input type="checkbox" id={type.value} className="checkbox" {...register(fieldName, { required: {value: isRequired, message: t('website.requiredField')}})} value={type.value} />
          <label htmlFor={type.value} className="text-sm text-gray-600 hover">{t(type.label)}</label>
        </div>
      )
    })}
    <p className="text-xs text-primary-400">{ errors[fieldName] && errors[fieldName].message}</p>
  </div>

 )
}
export default Checkbox;
