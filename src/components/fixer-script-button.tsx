import { useRef, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { Button } from './button';

export default function FixerScriptButtonComponent() {
    const [fixing, setFixing] = useState(false);
    const abortController = useRef(new AbortController());
    const handleFix = async () => {
        setFixing(true);
        try {
            const res = await nextFetch('fix', {
                signal: abortController.current.signal,
            });
            // eslint-disable-next-line no-console
            console.log(res);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        setFixing(false);
    };
    return (
        <div className="relative z-10">
            <div className="t-10 r-10 fixed">
                <Button disabled={fixing} onClick={handleFix}>
                    FIX DATA
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        abortController.current.abort();
                        setFixing(false);
                    }}
                >
                    cancel
                </Button>
            </div>
        </div>
    );
}
