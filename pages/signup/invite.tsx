import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { nextFetch } from 'src/utils/fetcher';

export default function Register() {
    const router = useRouter();
    const {
        values: { password, confirmPassword, firstName, lastName },
        setFieldValue
    } = useFields({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });
    const token = router.query.token as string;
    const [registering, setRegistering] = useState(false);
    const [inviteStatus, setInviteStatus] = useState('pending');

    useEffect(() => {
        const checkInvite = async () => {
            try {
                const tokenStatus = await nextFetch('company/accept-invite?token=' + token);
                if (tokenStatus?.message) setInviteStatus(tokenStatus?.message);
            } catch (error: any) {
                if (error.message) setInviteStatus(error.message);
            }
        };
        if (token) checkInvite();
    }, [token]);

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            {token && inviteStatus === 'Invite is valid' && (
                <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <div>
                        Someone invited you on <b>relay.club</b>. All you have to do is to accept
                        the invitation by setting an account password below.
                    </div>
                    <Input
                        label={'First Name'}
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        required
                        onChange={(e: any) => {
                            setFieldValue('firstName', e.target.value);
                        }}
                    />
                    <Input
                        label={'Last Name'}
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        required
                        onChange={(e: any) => {
                            setFieldValue('lastName', e.target.value);
                        }}
                    />
                    <Input
                        label={'Password'}
                        type="password"
                        placeholder="Enter a password"
                        value={password}
                        onChange={(e: any) => {
                            setFieldValue('password', e.target.value);
                        }}
                    />
                    <Input
                        label={'Confirm your password'}
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e: any) => {
                            setFieldValue('confirmPassword', e.target.value);
                        }}
                    />
                    <Button
                        disabled={
                            registering ||
                            !firstName ||
                            !lastName ||
                            !password ||
                            !confirmPassword ||
                            password !== confirmPassword ||
                            !token
                        }
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                setRegistering(true);
                                await nextFetch('company/accept-invite', {
                                    method: 'post',
                                    body: JSON.stringify({
                                        token,
                                        password,
                                        firstName,
                                        lastName
                                    })
                                });
                                toast.success('Invite accepted');
                                router.push('/login');
                            } catch (error: any) {
                                if (error.message) toast.error(error.message);
                                else toast.error('Unknown error');
                            } finally {
                                setRegistering(false);
                            }
                        }}
                    >
                        Set your password
                    </Button>
                </form>
            )}
            {token && inviteStatus === 'pending' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <div>Checking invite status...</div>
                </div>
            )}
            {token && inviteStatus !== 'pending' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>{inviteStatus}</h2>
                    <Button onClick={() => router.back()}>Back</Button>
                </div>
            )}
            {!token && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>No invite token</h2>
                    <Button onClick={() => router.back()}>Back</Button>
                </div>
            )}
        </div>
    );
}
