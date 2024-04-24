import type { AdminGetProfileQueries, AdminGetProfileResponse, AdminPutProfileResponse } from 'pages/api/admin/profile';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { emailRegex } from 'src/constants';
import { type CompanyDB, type ProfileDB } from 'src/utils/api/db';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';

const validateNumberAsString = (input: string) => {
    if (!input) return false;
    const isNumberRegexTest = /^\d+$/.test(input);
    if (!isNumberRegexTest) return false;
    const toNumberTest = Number(input);
    if (isNaN(toNumberTest)) return false;
    return true;
};

const cleanUserInput = (input: string) => {
    // remove spaces and line breaks
    return input
        .trim()
        .replace(/\r?\n|\r/g, '')
        .toLowerCase(); // all email engine account ids are lowercase and emails should be too
};

const validateEmail = (email: string | null) => {
    if (!email) return false;
    if (email.includes('/')) return false;
    if (!email.includes('boostbot.ai')) return false;
    return emailRegex.test(email);
};

const validateEmailEngineAccountId = (emailEngineAccountId: string | null) => {
    if (!emailEngineAccountId) return false;
    if (emailEngineAccountId.length !== 16) return false;
    // should be all letters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(emailEngineAccountId)) return false;
    return true;
};

const ProfileContainer = ({ initialProfile }: { initialProfile: ProfileDB }) => {
    const [profile, setProfile] = useState(initialProfile);
    const [submittingProfile, setSubmittingProfile] = useState<boolean>(false);
    const updateProfile: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);
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
            const res = await nextFetch<AdminPutProfileResponse>('admin/profile', {
                method: 'PUT',
                body: profile,
            });
            if (res.email) {
                toast.success('Profile updated');
            }
        } catch (error) {
            alert(error);
        } finally {
            setSubmittingProfile(false);
        }
    };
    return (
        <>
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
                    <Button disabled={submittingProfile} type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        </>
    );
};

const OnboardOutreach = () => {
    const [profiles, setProfiles] = useState<ProfileDB[] | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState<boolean>(false);
    const [isSubmittingCompany, setSubmittingCompany] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<CompanyDB>();

    const fetchProfileAndCompany: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setFetchingProfile(true);
        try {
            const res = await nextFetchWithQueries<AdminGetProfileQueries, AdminGetProfileResponse>('admin/profile', {
                email,
            });
            setProfiles(res);
            if (res.length > 0) {
                setCompany(res[0].company);
            }
        } catch (error) {
            alert(error);
        }
        setFetchingProfile(false);
    };

    const updateCompany: FormEventHandler<HTMLFormElement> = async (e) => {
        setSubmittingCompany(true);
        e.preventDefault();
        try {
            if (!company) {
                return;
            }
            if (!validateNumberAsString(company.profiles_limit)) {
                toast.error('Invalid profiles_limit');
                return;
            }
            if (!validateNumberAsString(company.searches_limit)) {
                toast.error('Invalid searches_limit');
                return;
            }
            if (!validateNumberAsString(company.trial_searches_limit)) {
                toast.error('Invalid trial_searches_limit');
                return;
            }
            if (!validateNumberAsString(company.trial_profiles_limit)) {
                toast.error('Invalid trial_profiles_limit');
                return;
            }
            const res = await nextFetch<AdminPutProfileResponse>('admin/company', {
                method: 'PUT',
                body: company,
            });
            if (res.email) {
                toast.success('Profile updated');
            }
        } catch (error) {
            alert(error);
        } finally {
            setSubmittingCompany(false);
        }
    };
    return (
        <Layout>
            <div className="p-6">
                <form onSubmit={fetchProfileAndCompany}>
                    <h2 className="text-lg font-bold">Search Profile</h2>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
                <>
                    {profiles && profiles.length > 0 ? (
                        profiles.map((profile) => <ProfileContainer key={profile.id} initialProfile={profile} />)
                    ) : !fetchingProfile ? (
                        <div>no profile</div>
                    ) : (
                        <div>
                            fetching profile <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                        </div>
                    )}
                </>
                <div>
                    {company && (
                        <>
                            <h2 className="text-lg font-bold">Company: {company.name}</h2>
                            <form onSubmit={updateCompany} className="flex flex-col space-y-4">
                                <label htmlFor="profiles_limit">profiles_limit</label>
                                <input
                                    id="profiles_limit"
                                    type="text"
                                    value={company.profiles_limit ?? ''}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            profiles_limit: cleanUserInput(e.target.value),
                                        })
                                    }
                                />
                                <label htmlFor="searches_limit">searches_limit</label>
                                <input
                                    id="searches_limit"
                                    type="text"
                                    value={company.searches_limit ?? ''}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            searches_limit: cleanUserInput(e.target.value),
                                        })
                                    }
                                />
                                <label htmlFor="trial_searches_limit">trial_searches_limit</label>
                                <input
                                    id="trial_searches_limit"
                                    type="text"
                                    value={company.trial_searches_limit ?? ''}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            trial_searches_limit: cleanUserInput(e.target.value),
                                        })
                                    }
                                />
                                <label htmlFor="trial_profiles_limit">trial_profiles_limit</label>
                                <input
                                    id="trial_profiles_limit"
                                    type="text"
                                    value={company.trial_profiles_limit ?? ''}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            trial_profiles_limit: cleanUserInput(e.target.value),
                                        })
                                    }
                                />

                                <Button disabled={isSubmittingCompany} type="submit">
                                    Submit
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default OnboardOutreach;
