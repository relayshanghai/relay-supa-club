import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

export default function Login() {
    const router = useRouter();
    const { login } = useUser();
    const {
        values: { email, password },
        setFieldValue
    } = useFields({
        email: '',
        password: ''
    });

    return (
        <div className="w-full h-full px-10 py-8">
            <div className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                relay.club
            </div>
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
                    onClick={async (e: any) => {
                        e.preventDefault();

                        try {
                            await login(email, password);
                            router.push('/');
                            toast.success('Succesfully logged in');
                        } catch (e: any) {
                            toast.error(e.message || 'Ooops! Something went wrong.');
                        }
                    }}
                >
                    Log in
                </Button>
            </form>
        </div>
    );
}
