const DotsCircle = ({ ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={props.className}
            onClick={props.onClick}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
};
export default DotsCircle;

DotsCircle.defaultProps = {
    className: 'w-6 h-6',
};
