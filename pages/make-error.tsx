/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Button } from 'src/components/button';
import { Layout } from 'src/components/layout';
import { useCompany } from 'src/hooks/use-company';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';

export default function MakeErrorPage() {
    // useEffect(() => {
    //     throw new Error('Error from MakeErrorPage');
    // }, []);
    const { company } = useCompany();
    useEffect(() => {
        if (!company) return;
        clientLogger('clientLogger error', 'error');
        clientLogger('clientLogger info', 'info');
        clientLogger('clientLogger warning', 'warn');
        nextFetch('make-error');
    }, [company]);
    const makeError = () => {
        throw new Error('Error from MakeErrorPage');
    };
    return (
        <Layout>
            <div>
                <h1>Make Error Page</h1>
                <p>See the console for the error.</p>
                <Button onClick={makeError}>Make error</Button>
            </div>
        </Layout>
    );
}
