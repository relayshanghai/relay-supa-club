import { useCallback, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { Button } from './button';

export default function FixerScriptButtonComponent() {
    const [fixing, setFixing] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const handleFix = useCallback(async () => {
        setFixing(true);
        try {
            const controller = new AbortController();
            setAbortController(controller);
            const res = await nextFetch('fix', {
                signal: controller.signal,
            });
            // eslint-disable-next-line no-console
            console.log(res);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        setFixing(false);
    }, []);

    return (
        <div className="relative z-10">
            <div className="t-10 r-10 fixed">
                <Button disabled={fixing} onClick={handleFix}>
                    FIX DATA
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        abortController?.abort();
                        setFixing(false);
                        nextFetch('fix', {
                            method: 'DELETE',
                        });
                    }}
                >
                    cancel
                </Button>
            </div>
        </div>
    );
}
