import type { AdminGetProfileGetQueries, AdminGetProfileGetResponse } from 'pages/api/admin/profile';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { emailRegex } from 'src/constants';
import type { ProfileDB } from 'src/utils/api/db';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';

const cleanUserInput = (input: string) => {
    // remove spaces and line breaks
    return input.trim().replace(/\r?\n|\r/g, '');
};

const validateEmail = (email: string | null) => {
    if (!email) return false;
    if (email.includes('/')) return false;
    if (!email.includes('boostbot.ai')) return false;
    return emailRegex.test(email);
};

const validateEmailEngineAccountId = (emailEngineAccountId: string | null) => {
    if (!emailEngineAccountId) return false;
    if (emailEngineAccountId.includes('/')) return false;
    if (emailEngineAccountId.length !== 16) return false;
    return true;
};

const OnboardOutreach = () => {
    const [profile, setProfile] = useState<ProfileDB | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const fetchProfile: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setFetchingProfile(true);
        try {
            const res = await nextFetchWithQueries<AdminGetProfileGetQueries, AdminGetProfileGetResponse>(
                'admin/profile',
                { email },
            );
            if (res.email) {
                setProfile(res);
            }
        } catch (error) {
            alert(error);
        }
        setFetchingProfile(false);
    };

    const updateProfile: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            if (!profile) {
                return;
            }
            if (!validateEmail(profile.sequence_send_email)) {
                toast.error('Invalid email');
                return;
            }
            if (!validateEmailEngineAccountId(profile.email_engine_account_id)) {
                toast.error('Invalid email_engine_account_id');
                return;
            }
            const res = await nextFetch<AdminGetProfileGetResponse>('admin/profile', {
                method: 'PUT',
                body: profile,
            });
            if (res.email) {
                setProfile(res);
                toast.success('Profile updated');
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Layout>
            <div className="p-6">
                <form onSubmit={fetchProfile}>
                    <h2 className="text-lg font-bold">Search Profile</h2>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
                <>
                    {profile ? (
                        <div className="flex max-w-md flex-col space-y-4 pt-6">
                            <h2 className="text-lg font-bold">Update profile: {profile.email}</h2>
                            <form onSubmit={updateProfile} className="flex flex-col space-y-4">
                                <label htmlFor="email_engine_account_id">email_engine_account_id</label>
                                <input
                                    id="email_engine_account_id"
                                    type="text"
                                    value={profile.email_engine_account_id ?? ''}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            email_engine_account_id: cleanUserInput(e.target.value),
                                        })
                                    }
                                />
                                <label htmlFor="sequence_send_email">sequence_send_email</label>
                                <input
                                    id="sequence_send_email"
                                    type="text"
                                    value={profile.sequence_send_email ?? ''}
                                    onChange={(e) =>
                                        setProfile({ ...profile, sequence_send_email: cleanUserInput(e.target.value) })
                                    }
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </div>
                    ) : !fetchingProfile ? (
                        <div>no profile</div>
                    ) : (
                        <div>
                            fetching profile <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                        </div>
                    )}
                </>
            </div>
        </Layout>
    );
};

export default OnboardOutreach;
