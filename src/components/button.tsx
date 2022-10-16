export const Button = ({ children, ...rest }: any) => {
    return (
        <button
            className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default"
            {...rest}
        >
            {children}
        </button>
    );
};
