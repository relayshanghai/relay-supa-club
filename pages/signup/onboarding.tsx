import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Spinner } from 'src/components/spinner';
import { Title } from 'src/components/title';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

export default function Register() {
    const router = useRouter();
    const { user, loading, profile, session } = useUser();
    const { createCompany } = useCompany();
    const { values, setFieldValue } = useFields({
        name: '',
        website: ''
    });

    useEffect(() => {
        if (!loading && profile.onboarding) {
            router.push('/dashboard');
        }
    }, [loading, profile, router]);

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="py-8">
                            <div className="font-bold">
                                Then, let&rsquo;s create your company profile
                            </div>
                        </div>
                        <Input
                            label={'Company name'}
                            type="company_name"
                            placeholder="Enter your Company name"
                            value={values.name}
                            required
                            onChange={(e: any) => {
                                setFieldValue('name', e.target.value);
                            }}
                        />
                        <Input
                            label={'Company website'}
                            type="company_website"
                            placeholder="Enter your website url"
                            value={values.website}
                            required
                            onChange={(e: any) => {
                                setFieldValue('website', e.target.value);
                            }}
                        />
                        <Button
                            disabled={!values.name}
                            onClick={async (e: any) => {
                                e.preventDefault();

                                try {
                                    await createCompany(values);
                                    toast.success('Company created');
                                    router.push('/dashboard');
                                } catch (e) {
                                    console.log(e);
                                    toast.error('Ops, something went wrong');
                                }
                            }}
                        >
                            Create company
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}
