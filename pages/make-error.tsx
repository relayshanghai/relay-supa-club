import { useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';

export default function MakeErrorPage() {
    // useEffect(() => {
    //     throw new Error('Error from MakeErrorPage');
    // }, []);
    useEffect(() => {
        clientLogger('clientLogger error', 'error');
        clientLogger('clientLogger info', 'info');
        clientLogger('clientLogger warning', 'warning');
        nextFetch('make-error');
    }, []);
    return (
        <div>
            <h1>Make Error Page</h1>
            <p>See the console for the error.</p>
        </div>
    );
}
