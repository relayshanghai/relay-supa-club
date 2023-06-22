import type { PropsWithChildren } from 'react';
import { useEffect, useState, useContext } from 'react';
import React, { createContext } from 'react';
import * as ruddersdk from 'rudder-sdk-js';

const RudderstackContext = createContext<typeof ruddersdk | null>(null);

export const useRudderstack = () => useContext(RudderstackContext);
type RudderstackProviderProps = PropsWithChildren;

export default function RudderstackProvider({ children, ..._props }: RudderstackProviderProps) {
    const [rudderstack, setRudderstack] = useState<typeof ruddersdk | null>(null);

    useEffect(() => {
        ruddersdk.ready(() => {
            setRudderstack(ruddersdk);
        });

        ruddersdk.load(
            process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY || '',
            process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL || '',
        );

        return () => {
            setRudderstack(null);
        };
    }, []);

    return <RudderstackContext.Provider value={rudderstack}>{children}</RudderstackContext.Provider>;
}
