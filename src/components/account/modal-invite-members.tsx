import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { Input } from '../input';
import { Modal } from '../modal';
import { AccountContext } from './account-context';

export const InviteMembersModal = ({
    showAddMoreMembers,
    setShowAddMoreMembers,
    inviteEmail,
    setInviteEmail,
}: {
    showAddMoreMembers: boolean;
    setShowAddMoreMembers: (show: boolean) => void;
    inviteEmail: string;
    setInviteEmail: (email: string) => void;
}) => {
    const { createInvite } = useContext(AccountContext);

    const { t } = useTranslation();

    return (
        <Modal
            title={t('account.invite.title') || ''}
            visible={showAddMoreMembers}
            onClose={() => setShowAddMoreMembers(false)}
        >
            <h3 className="py-4">{t('account.invite.inviteMoreMembers')}</h3>
            <div>
                <Input
                    type="email"
                    placeholder={t('account.invite.typeEmailAddressHere') || ''}
                    label={t('account.invite.emailAddress') || ''}
                    value={inviteEmail}
                    required
                    onChange={(e) => setInviteEmail(e.target.value)}
                />
            </div>
            <div className="pt-8 space-x-16 justify-center flex flex-row w-full">
                <Button
                    disabled={!inviteEmail}
                    onClick={async () => {
                        await createInvite(inviteEmail);
                        setInviteEmail('');
                        setShowAddMoreMembers(false);
                        toast.success('Invite sent');
                    }}
                >
                    {t('account.invite.sendInvitation')}
                </Button>
                <Button variant="secondary" onClick={async () => setShowAddMoreMembers(false)}>
                    {t('account.invite.cancel')}{' '}
                </Button>
            </div>
        </Modal>
    );
};
