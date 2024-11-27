import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

export const SuccessCallback = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="relative min-h-[490px] w-[620px] flex-col items-center justify-start gap-16 rounded-xl border-2 border-violet-600 bg-white shadow">
                <Image
                    className="absolute left-4 top-4"
                    src="/assets/imgs/logos/boostbot.svg"
                    width={25}
                    height={25}
                    alt="BoostBot Logo"
                />
                <div className="my-24 flex min-h-[298px] flex-col items-center justify-start gap-8 self-stretch px-8">
                    <div className="flex min-h-[298px] flex-col items-center justify-start gap-12 self-stretch">
                        <div className="flex min-h-[210px] flex-col items-center justify-start gap-6 self-stretch">
                            <div className="flex min-h-[156px] flex-col items-start justify-start gap-3 self-stretch">
                                <div className="self-stretch text-center font-['Poppins'] text-base font-semibold leading-normal text-green-500">
                                    {t('subscription.paymentCallback.title')}
                                </div>
                                <div className="self-stretch text-center font-['Poppins'] text-5xl font-semibold leading-[60px] text-gray-900">
                                    {t('subscription.paymentCallback.thankYou')}
                                </div>
                            </div>
                            <div className="self-stretch text-center font-['Poppins'] text-xl font-normal leading-[30px] text-slate-600">
                                {t('subscription.paymentCallback.redirection')}
                            </div>
                        </div>
                        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2">
                            <div className="font-['Poppins'] text-base font-semibold leading-normal text-gray-400">
                                <Link href={'/account'}>{t('subscription.paymentCallback.clickHere')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
