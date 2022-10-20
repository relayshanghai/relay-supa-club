import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Layout } from 'src/components/layout';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { Search } from 'src/modules/search';

const Page = () => {
    const { profile, user, loading, updateProfile } = useUser();
    const {
        values: { firstName, lastName, email },
        setFieldValue,
        reset
    } = useFields({
        firstName: undefined,
        lastName: undefined,
        email: undefined
    });
    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValue,
        reset: resetCompanyValues
    } = useFields({
        name: undefined,
        website: undefined
    });
    const { company, updateCompany } = useCompany();

    useEffect(() => {
        if (!loading && profile) {
            reset({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email
            });
        }
    }, [loading, profile, user, reset]);

    useEffect(() => {
        if (company) {
            resetCompanyValues({ ...company });
        }
    }, [company, resetCompanyValues]);

    return (
        <Layout>
            <div className="flex flex-col p-6 space-y-6">
                <div className="text-lg font-bold">Account</div>
                <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg">
                    <div className="">Here you can change your personal account details.</div>
                    <div className={`w-1/3 ${loading ? 'opacity-50' : ''}`}>
                        <Input
                            label={'First Name'}
                            type="first_name"
                            placeholder="Enter your first name"
                            value={firstName}
                            required
                            onChange={(e: any) => {
                                setFieldValue('firstName', e.target.value);
                            }}
                        />
                        <Input
                            label={'Last Name'}
                            type="last_name"
                            placeholder="Enter your last name"
                            value={lastName}
                            required
                            onChange={(e: any) => {
                                setFieldValue('lastName', e.target.value);
                            }}
                        />
                        <Input
                            label={'Email'}
                            type="email"
                            placeholder="hello@relay.club"
                            value={email}
                            required
                            onChange={(e: any) => {
                                setFieldValue('email', e.target.value);
                            }}
                        />
                    </div>
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
                {profile?.admin ? (
                    <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg">
                        <div className="">Here you can change your Company account details.</div>
                        <div className={`flex flex-row space-x-4 ${loading ? 'opacity-50' : ''}`}>
                            <Input
                                label={'Company name'}
                                type="text"
                                value={companyValues.name}
                                required
                                onChange={(e: any) => {
                                    setCompanyFieldValue('name', e.target.value);
                                }}
                            />
                            <Input
                                label={'Website'}
                                type="text"
                                value={companyValues.website}
                                placeholder="website address"
                                required
                                onChange={(e: any) => {
                                    setCompanyFieldValue('website', e.target.value);
                                }}
                            />
                        </div>
                        <Button
                            disabled={loading}
                            onClick={async () => {
                                try {
                                    await updateCompany(companyValues);
                                    toast.success('Company profile updated');
                                } catch (e) {
                                    toast.error('Ops, something went wrong.');
                                }
                            }}
                        >
                            Update
                        </Button>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
};

export default Page;
