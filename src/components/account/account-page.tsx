import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';

export const AccountPage = () => {
    return (
        <div className="flex flex-col p-6 space-y-6">
            <div className="text-lg font-bold">Account</div>
            <PersonalDetails />
            <CompanyDetails />
            <SubscriptionDetails />
        </div>
    );
};
