import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../button';
import { Input } from '../input';
import { AccountContext } from './account-context';

export const PersonalDetails = () => {
    const { loading, firstName, lastName, email, setUserFieldValues, updateProfile } =
        useContext(AccountContext);
    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <div className="">Here you can change your personal account details.</div>
            <div className={`w-full ${loading ? 'opacity-50' : ''}`}>
                <Input
                    label={'First Name'}
                    type="first_name"
                    placeholder="Enter your first name"
                    value={firstName}
                    required
                    onChange={(e: any) => {
                        setUserFieldValues('firstName', e.target.value);
                    }}
                />
                <Input
                    label={'Last Name'}
                    type="last_name"
                    placeholder="Enter your last name"
                    value={lastName}
                    required
                    onChange={(e: any) => {
                        setUserFieldValues('lastName', e.target.value);
                    }}
                />
                <Input
                    label={'Email'}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    required
                    onChange={(e: any) => {
                        setUserFieldValues('email', e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-row justify-end w-full">
                <Button
                    disabled={loading}
                    onClick={async () => {
                        try {
                            await updateProfile({
                                first_name: firstName,
                                last_name: lastName,
                                email: email
                            });
                            toast.success('Profile updated');
                        } catch (e) {
                            toast.error('Ops, something went wrong.');
                        }
                    }}
                >
                    Update
                </Button>
            </div>
        </div>
    );
};
