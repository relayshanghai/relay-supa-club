import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

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

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-5">
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
                <Input
                    label={'Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    required
                    onChange={(e: any) => {
                        setFieldValue('password', e.target.value);
                    }}
                />
                <Input
                    label={'Confirm Password'}
                    type="password"
                    placeholder="Enter your password"
                    value={confirmPassword}
                    required
                    onChange={(e: any) => {
                        setFieldValue('confirmPassword', e.target.value);
                    }}
                />
                <Button
                    disabled={
                        !firstName ||
                        !lastName ||
                        !email ||
                        !password ||
                        password !== confirmPassword
                    }
                    onClick={async (e: any) => {
                        e.preventDefault();

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
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.log(e);
                            toast.error('Ops, something went wrong');
                        }
                    }}
                >
                    Sign up
                </Button>
                <p className="inline text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login">
                        <p className="inline text-primary-700 hover:text-primary-600 cursor-pointer">
                            Log in
                        </p>
                    </Link>
                </p>
            </form>
        </div>
    );
}
