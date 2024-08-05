import { InboxPageDummy } from 'src/components/inbox/inbox-page-dummy';
import { useUser } from 'src/hooks/use-user';
import Inbox from '../component-previews/inbox-new';

export default function Page() {
    const { profile } = useUser();
    if (!profile?.email_engine_account_id) {
        return <InboxPageDummy />;
    }
    return <Inbox />;
}
