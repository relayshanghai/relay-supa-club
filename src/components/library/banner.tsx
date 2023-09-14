import Link from 'next/link';
import { BoostbotSelected, Thunder } from '../icons';

export const Banner = ({ title, message, buttonText }: { title: string; message: string; buttonText: string }) => {
    return (
        <div className="sticky top-0 isolate z-50 flex items-center gap-x-6 overflow-hidden rounded-b-md bg-gradient-to-t from-violet-600 via-violet-500 to-violet-400 px-6 py-2.5 text-white shadow-lg">
            <div className="flex flex-1">
                <div className="rounded-full bg-white px-2 py-1">
                    <BoostbotSelected className="h-8 w-6" />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6">
                    <strong className="font-semibold">{title}</strong>
                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                        <circle cx={1} cy={1} r={1} />
                    </svg>
                    {message}
                </p>
                <Link
                    href="/pricing"
                    className="flex flex-row items-center rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-primary-500 shadow-sm"
                >
                    <Thunder className="h-5 w-5 stroke-primary-500" /> {buttonText}
                </Link>
            </div>
            <div className="flex flex-1 justify-end" />
        </div>
    );
};
