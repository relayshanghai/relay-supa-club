const ErrorTest = () => {
    const clickHandler = () => {
        throw new Error('Test error!');
    };

    return <button onClick={clickHandler}>Throw Error!</button>;
};

export default ErrorTest;
