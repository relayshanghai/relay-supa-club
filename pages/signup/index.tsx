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
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <div className="py-8">
                    <div className="font-bold">First, let&rsquo;s create an account for you</div>
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
                            console.log(e);
                            toast.error('Ops, something went wrong');
                        }
                    }}
                >
                    Sign up
                </Button>
            </form>
        </div>
    );
}
