/* eslint-disable @typescript-eslint/no-var-requires */
// pages/_error.tsx
function Error({ statusCode }: any) {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    );
}

Error.getInitialProps = ({ res, err }: any) => {
    if (typeof window == 'undefined') {
        const newrelic = require('newrelic');
        newrelic.noticeError(err);
    } else {
        //@ts-ignore
        window.newrelic.noticeError(err);
    }

    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
