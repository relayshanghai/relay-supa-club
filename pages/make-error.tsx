import { useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';

export default function MakeErrorPage() {
    useEffect(() => {
        throw new Error('Error from MakeErrorPage');
    }, []);
    useEffect(() => {
        nextFetch('make-error');
        clientLogger('clientLogger error', 'error');
    }, []);
    return (
        <div>
            <h1>Make Error Page</h1>
            <p>See the console for the error.</p>
        </div>
    );
}
