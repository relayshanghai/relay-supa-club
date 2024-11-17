import { useTranslation } from 'react-i18next';
import { TopUpCard } from './topup-card';
import { screenshots } from 'public/assets/imgs/screenshots';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageToggle } from '../common/language-toggle';
import { type TopUpSizes } from 'src/hooks/use-topups';
import { usePlans } from 'src/hooks/use-plans';
import { useEffect, useState } from 'react';

const ImageBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] h-screen w-screen">
            <Image
                src={screenshots.discoverPageEn}
                alt="Background"
                fill
                quality={50}
                className="absolute h-full w-full opacity-50 blur-[8px]"
            />
        </div>
    );
};

export const TopUpPage = () => {
    const { t } = useTranslation();
    const { getPlans, plans } = usePlans();
    const [bundles, setBundles] = useState<string[]>([]);

    useEffect(() => {
        getPlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (plans.length) {
            const bundles = Array.from(new Set(plans.map((plan) => plan.itemName)));
            setBundles(bundles);
        }
    }, [plans]);

    return (
        <>
            <ImageBackground />
            <main className={`flex flex-grow flex-col`}>
                <div className="flex w-full justify-end space-x-3 p-4">
                    <LanguageToggle />

                    <Link className=" font-semibold text-gray-400" href="/account">
                        {t('pricing.backToAccount')}
                    </Link>
                </div>

                <div className="container mx-auto flex flex-col items-center">
                    <div className="mx-auto max-w-3xl pb-10 text-center">
                        <h2 className="font-heading mb-6 text-3xl font-semibold text-gray-800 md:text-4xl">
                            Need More Credits?
                        </h2>
                        <h4 className="-mt-2 text-3xl font-semibold text-primary-600 md:text-4xl">
                            Choose the amount that suits you best
                        </h4>
                    </div>
                    <div
                        className={`container m-auto flex min-h-[32rem] w-full max-w-screen-xl flex-wrap justify-center`}
                    >
                        {bundles.map((option) => (
                            <TopUpCard key={option} topUpSize={option as TopUpSizes} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};
