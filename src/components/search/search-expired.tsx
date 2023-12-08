import Link from 'next/link';
import { Button } from '../button';
import { Thunder } from '../icons';

export const SearchExpired = () => {
    return (
        <div className="flex flex-col items-end gap-3 rounded-xl bg-white p-5 shadow-xl">
            <div className="flex w-fit gap-3 ">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <Thunder className="h-7 w-7 stroke-primary-600 stroke-1" />
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <p className="text-xl font-semibold">Credit Limit Exceeded</p>
                    <p className="text-sm font-medium leading-3 text-gray-600">
                        {"To discover more influencers you'll need to upgrade your account"}
                    </p>
                </div>
            </div>
            <Link href="/upgrade" className="items-end">
                <Button className="ml-auto">Upgrade my account</Button>
            </Link>
        </div>
    );
};
