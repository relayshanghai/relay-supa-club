export default function FormWrapper({ title, desc, children, isRequired }) {
    return (
        <div className="mb-6 flex-row justify-between md:flex">
            <div className="mb-4 md:mb-0 md:mr-12 md:w-1/3">
                <div className="text-sm font-semibold text-tertiary-600 sm:mb-1">
                    {title}
                    {isRequired && ' *'}
                </div>
                <div className="grow text-xs text-tertiary-400">{desc}</div>
            </div>
            <div className="py-1 md:w-1/2">{children}</div>
        </div>
    );
}
