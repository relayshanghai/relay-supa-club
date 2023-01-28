const DotsHorizontal = ({ ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={props.className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
        </svg>
    );
};
export default DotsHorizontal;

DotsHorizontal.defaultProps = {
    className: 'w-6 h-6',
};
