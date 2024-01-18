import { InboxPageDummy } from 'src/components/inbox/inbox-page-dummy';
import { useUser } from 'src/hooks/use-user';
import { InboxPage } from 'src/components/inbox/inbox-page';

export default function Page() {
    const { profile } = useUser();
    if (!profile?.email_engine_account_id) {
        return <InboxPageDummy />;
    }
    return <InboxPage />;
}
