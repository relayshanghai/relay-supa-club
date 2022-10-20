export const Button = ({ children, type, ...rest }: any) => {
    return (
        <button
            className={`text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default ${
                !type || type === 'primary'
                    ? 'text-white bg-primary-500 hover:bg-primary-700'
                    : type === 'secondary'
                    ? 'text-primary-500 bg-white border-primary-500 border hover:bg-primary-700/10'
                    : ''
            }`}
            {...rest}
        >
            {children}
        </button>
    );
};
