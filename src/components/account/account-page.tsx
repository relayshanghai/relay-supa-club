import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';
import { InviteMembersModal } from './modal-invite-members';
import { SubscriptionConfirmModal } from './subscription-confirm-modal';

export const AccountPage = () => {
    return (
        <>
            <SubscriptionConfirmModal />
            <InviteMembersModal />

            <div className="flex flex-col p-6 space-y-6">
                <div className="text-lg font-bold">Account</div>
                <PersonalDetails />
                <CompanyDetails />

                <SubscriptionDetails />
            </div>
        </>
    );
};
