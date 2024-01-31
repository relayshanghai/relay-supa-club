import { InboxPageDummy } from 'src/components/inbox/inbox-page-dummy';
import { useUser } from 'src/hooks/use-user';
import InboxPreview from './component-previews/inbox';

export default function Page() {
    const { profile } = useUser();
    if (!profile?.email_engine_account_id) {
        return <InboxPageDummy />;
    }
    return <InboxPreview />;
}
