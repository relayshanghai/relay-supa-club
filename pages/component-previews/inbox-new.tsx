import ThreadList from "src/components/inbox/thread-list";
import { Layout } from "src/components/layout";

export default function Inbox() {
    return (        
        <Layout>
            <div className="flex h-full max-h-screen bg-white">
                <ThreadList/>
            </div>
        </Layout>

    )
}