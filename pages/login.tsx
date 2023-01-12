import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

export default function Login() {
    const router = useRouter();
    const { login, loading, profile } = useUser();
    const {
        values: { email, password },
        setFieldValue
    } = useFields({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (!loading && !!profile?.id) {
            if (!profile.company_id) {
                router.push('/signup/onboarding');
            } else {
                router.push('/dashboard');
            }
        }
    }, [loading, profile, router]);

    const handleSubmit = async () => {
        try {
            await login(email, password);
            toast.success('Successfully logged in');
        } catch (error: any) {
            toast.error(error.message || 'Ops, something went wrong.');
        }
    };

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                <div className="text-left w-full">
                    <h1 className="font-bold text-4xl mb-2">Log in</h1>
                    <h3 className="text-sm text-gray-600 mb-8">Welcome back!</h3>
                </div>
                <Input
                    label={'Email'}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    onChange={(e) => setFieldValue('email', e.target.value)}
                />
                <Input
                    label={'Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                />
                <Button
                    disabled={loading}
                    onClick={(e) => {
                        e.preventDefault();

                        handleSubmit();
                    }}
                >
                    Log in
                </Button>
                <p className="inline text-gray-500 text-sm">
                    {`Don't have an account? `}
                    <Link href="/signup">
                        <a className="inline text-primary-700 hover:text-primary-600 cursor-pointer">
                            Sign up
                        </a>
                    </Link>
                    {` now.`}
                </p>
            </form>
        </div>
    );
}
