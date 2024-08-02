import { useEffect } from 'react';
import Profile from 'src/components/inbox/profile';
import ThreadList from 'src/components/inbox/thread-list';
import ThreadMessages from 'src/components/inbox/thread-message';
import { Layout } from 'src/components/layout';
import { inboxGuide } from 'src/guides/inbox.guide';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { useThreadStore } from 'src/hooks/v2/use-thread';

export default function Inbox() {
    const selectedThread = useThreadStore((state) => state.selectedThread);
    const { setGuides, startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        setGuides({
            'inbox#threads': inboxGuide,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guidesReady) {
            startTour('inbox#threads');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady]);

    return (
        <Layout>
            <div className="flex h-full max-h-screen bg-white">
                <ThreadList />
                <ThreadMessages />
                {selectedThread && <Profile />}
            </div>
        </Layout>
    );
}
