import { Button } from 'src/components/button';
import { Input } from 'src/components/input';

export default function Login() {
    return (
        <div className="w-full h-full px-10 py-8">
            <div className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                relay.club
            </div>
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <Input label={'Email'} type="email" placeholder="hello@relay.club" />
                <Input label={'Password'} type="password" placeholder="Enter your password" />
                <Button>Log in</Button>
            </form>
        </div>
    );
}
