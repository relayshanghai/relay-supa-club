/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Button } from 'src/components/button';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';

export default function MakeErrorPage() {
    // useEffect(() => {
    //     throw new Error('Error from MakeErrorPage');
    // }, []);
    useEffect(() => {
        clientLogger('clientLogger error', 'error');
        clientLogger('clientLogger info', 'info');
        clientLogger('clientLogger warning', 'warn');
        nextFetch('make-error');
    }, []);
    const makeError = () => {
        throw new Error('Error from MakeErrorPage');
    };
    return (
        <div>
            <h1>Make Error Page</h1>
            <p>See the console for the error.</p>
            <Button onClick={makeError}>Make error</Button>
        </div>
    );
}
