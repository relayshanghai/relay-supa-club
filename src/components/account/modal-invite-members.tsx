import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { createInviteErrors } from 'src/errors/company';
import { useCompany } from 'src/hooks/use-company';
import { InvitesDB } from 'src/utils/api/db';
import { hasCustomError } from 'src/utils/errors';
import { Button } from '../button';
import { Input } from '../input';
import { Modal } from '../modal';

export const InviteMembersModal = ({
    showAddMoreMembers,
    setShowAddMoreMembers,
    createInvite,
}: {
    showAddMoreMembers: boolean;
    setShowAddMoreMembers: (show: boolean) => void;
    createInvite: (email: string, companyOwner: boolean) => Promise<InvitesDB>;
}) => {
    const { refreshCompany } = useCompany();
    const [companyOwner, setCompanyOwner] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation();
    const handleSendInvite = async () => {
        try {
            setSubmitting(true);
            await createInvite(inviteEmail, companyOwner);
            setInviteEmail('');
            setShowAddMoreMembers(false);
            toast.success('Invite sent');
            refreshCompany();
        } catch (error: any) {
            if (hasCustomError(error, createInviteErrors)) {
                toast.error(t(`login.${error.message}`));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setSubmitting(false);
        }
    };
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

                <input
                    type="checkbox"
                    id="companyOwner"
                    onChange={() => setCompanyOwner(!companyOwner)}
                    checked={companyOwner}
                />
                <label htmlFor="companyOwner" className="ml-2 text-sm">
                    {t('account.invite.makeAdmin')}
                </label>
            </div>
            <div className="flex w-full flex-row justify-center space-x-16 pt-8">
                <Button disabled={!inviteEmail || submitting} onClick={handleSendInvite}>
                    {t('account.invite.sendInvitation')}
                </Button>
                <Button variant="secondary" onClick={async () => setShowAddMoreMembers(false)}>
                    {t('account.invite.cancel')}
                </Button>
            </div>
        </Modal>
    );
};
