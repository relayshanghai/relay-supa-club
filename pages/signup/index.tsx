import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger';

export default function Register() {
    const router = useRouter();
    const {
        values: { firstName, lastName, email, password, confirmPassword },
        setFieldValue
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { signup } = useUser();

    const handleSubmit = async () => {
        try {
            await signup({
                email,
                password,
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            });
            router.push('/signup/onboarding');
        } catch (error) {
            clientLogger(error, 'error');
            toast.error('Ops, something went wrong');
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
                    <h1 className="font-bold text-4xl mb-2">Sign up</h1>
                    <h3 className="text-sm text-gray-600 mb-8">
                        Start your free 30 day trial now.
                    </h3>
                </div>
                <Input
                    label={'First Name'}
                    type="first_name"
                    placeholder="Enter your first name"
                    value={firstName}
                    required
                    onChange={(e) => setFieldValue('firstName', e.target.value)}
                />
                <Input
                    label={'Last Name'}
                    type="last_name"
                    placeholder="Enter your last name"
                    value={lastName}
                    required
                    onChange={(e) => setFieldValue('lastName', e.target.value)}
                />
                <Input
                    label={'Email'}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    required
                    onChange={(e) => setFieldValue('email', e.target.value)}
                />
                <Input
                    label={'Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    required
                    onChange={(e) => setFieldValue('password', e.target.value)}
                />
                <Input
                    label={'Confirm Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={confirmPassword}
                    required
                    onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                />
                <Button
                    disabled={
                        !firstName ||
                        !lastName ||
                        !email ||
                        !password ||
                        password !== confirmPassword
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Sign up
                </Button>
                <p className="inline text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login">
                        <a className="inline text-primary-700 hover:text-primary-600 cursor-pointer">
                            Log in
                        </a>
                    </Link>
                </p>
            </form>
        </div>
    );
}
