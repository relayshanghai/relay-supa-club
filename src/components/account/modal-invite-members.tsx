import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../button';
import { Input } from '../input';
import { Modal } from '../modal';
import { AccountContext } from './account-context';

export const InviteMembersModal = () => {
    const { inviteEmail, setInviteEmail, showAddMoreMembers, setShowAddMoreMembers, createInvite } =
        useContext(AccountContext);
    return (
        <Modal
            title={'Invite members'}
            visible={!!showAddMoreMembers}
            onClose={() => {
                setShowAddMoreMembers(false);
            }}
        >
            <div className="py-4">Invite more members to your company</div>
            <div>
                <Input
                    type="email"
                    placeholder="Type here the email address"
                    label="Email address"
                    value={inviteEmail}
                    required
                    onChange={(e: any) => {
                        setInviteEmail(e.target.value);
                    }}
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
                    Send invitation
                </Button>
                <Button
                    variant="secondary"
                    onClick={async () => {
                        setShowAddMoreMembers(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};
