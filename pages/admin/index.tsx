import Link from 'next/link';
import { Layout } from 'src/components/layout';

const AdminPage = () => {
    const pages = ['clients', 'onboard-outreach', 'plans', 'trials'];
    return (
        <Layout>
            <div className="mx-2 my-2 flex gap-2">
                {pages.map((d) => (
                    <Link key={d} href={`/admin/${d}`} className="text-blue-500">
                        <div className="flex min-w-[100px] justify-center bg-white p-4 text-center hover:bg-slate-300">
                            {d.replace(/-/g, ' ').toUpperCase()}
                        </div>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default AdminPage;
