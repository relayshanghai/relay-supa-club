import { useUser } from 'src/hooks/use-user';

const Page = () => {
    const { profile } = useUser();

    return (
        <div className="w-full h-full px-10 py-8">
            <div className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                relay.club
            </div>
            Dashboard {profile.first_name}
        </div>
    );
};

export default Page;
