import type { PropsWithChildren } from 'react';
import { useState, useContext, useEffect } from 'react';
import React, { createContext } from 'react';
import type { rudderstack } from './rudderstack';
import { loadRudderstack } from './rudderstack';

// @ts-ignore
const RudderstackContext = createContext<rudderstack>(null);

export const useRudderstack = () => useContext(RudderstackContext);
type RudderstackProviderProps = PropsWithChildren<{
    writeKey?: string;
    dataPlane?: string;
}>;

export default function RudderstackProvider({ children, writeKey, dataPlane }: RudderstackProviderProps) {
    const [rudder, setRudderstack] = useState<rudderstack | null>(null);

    useEffect(() => {
        loadRudderstack(
            writeKey ?? process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY ?? '',
            dataPlane ?? process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL ?? '',
            (rudderstack: rudderstack) => setRudderstack(rudderstack),
        );
    }, [writeKey, dataPlane]);

    // @todo create a loading skeleton
    if (rudder === null) return <></>;

    return <RudderstackContext.Provider value={rudder}>{children}</RudderstackContext.Provider>;
}
