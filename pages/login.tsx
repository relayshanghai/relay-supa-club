import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

export default function Login() {
    const router = useRouter();
    const { login, loading, profile, session } = useUser();
    const {
        values: { email, password },
        setFieldValue
    } = useFields({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (!loading && session && profile) {
            if (!profile.onboarding) {
                router.push('/signup/onboarding');
            } else {
                router.push('/dashboard');
            }
        }
    }, [session, loading, profile, router]);

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <Input
                    label={'Email'}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    onChange={(e: any) => {
                        setFieldValue('email', e.target.value);
                    }}
                />
                <Input
                    label={'Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: any) => {
                        setFieldValue('password', e.target.value);
                    }}
                />
                <Button
                    disabled={loading}
                    onClick={async (e: any) => {
                        e.preventDefault();

                        try {
                            await login(email, password);
                            toast.success('Successfully logged in');
                        } catch (e: any) {
                            toast.error(e.message || 'Ops, something went wrong.');
                        }
                    }}
                >
                    Log in
                </Button>
            </form>
        </div>
    );
}
