export default function FormWrapper({ title, desc, children, isRequired }) {
    return (
        <div className="md:flex flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0 md:mr-12 md:w-1/3">
                <div className="text-sm text-tertiary-600 font-semibold sm:mb-1">
                    {title}
                    {isRequired && ' *'}
                </div>
                <div className="text-xs text-tertiary-400 grow">{desc}</div>
            </div>
            <div className="md:w-1/2 py-1">{children}</div>
        </div>
    );
}
