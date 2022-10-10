export const Input = ({ label, ...rest }: any) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
            {label}
            <input
                className="bg-white border outline-none text-sm text-gray-600 border-gray-200 h-10 rounded px-2 duration-300 focus-within:border-primary-500 placeholder-gray-300 my-2"
                {...rest}
            />
        </label>
    );
};
