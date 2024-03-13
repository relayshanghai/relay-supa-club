import Profile from 'src/components/inbox/profile';
import ThreadList from 'src/components/inbox/thread-list';
import ThreadMessages from 'src/components/inbox/thread-message';
import { Layout } from 'src/components/layout';
import { useThreadStore } from 'src/hooks/v2/use-thread';

export default function Inbox() {
    const selectedThread = useThreadStore((state) => state.selectedThread);
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
