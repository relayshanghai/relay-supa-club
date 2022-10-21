export const Input = ({ label, ...rest }: any) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
            <div>
                {label}
                {rest.required ? <span className="text-xs ml-1 text-primary-500">*</span> : null}
            </div>
            <input
                className="text-gray-900 ring-gray-900 ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2"
                {...rest}
            />
        </label>
    );
};
