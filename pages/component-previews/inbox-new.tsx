import ThreadList from "src/components/inbox/thread-list";
import ThreadMessages from "src/components/inbox/thread-message";
import { Layout } from "src/components/layout";

export default function Inbox() {
    return (        
        <Layout>
            <div className="flex h-full max-h-screen bg-white">
                <ThreadList/>
                <ThreadMessages/>
            </div>

        </Layout>

    )
}