import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';

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

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <div>
                    Someone invited you on <b>relay.club</b>. All you have to do is to accept the
                    invitation by setting an account password below.
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
                        !firstName ||
                        !lastName ||
                        !password ||
                        !confirmPassword ||
                        password !== confirmPassword ||
                        !router.query.token
                    }
                    onClick={async (e: any) => {
                        e.preventDefault();

                        // Call the invite endpoint
                        const res = await (
                            await fetch('/api/company/accept-invite', {
                                method: 'post',
                                body: JSON.stringify({
                                    token: router.query.token,
                                    password,
                                    firstName,
                                    lastName
                                })
                            })
                        ).json();

                        if (res.error) {
                            toast.error('Something went wrong');
                        } else {
                            toast.success('Invite accepted');
                            router.push('/login');
                        }
                    }}
                >
                    Set your password
                </Button>
            </form>
        </div>
    );
}
