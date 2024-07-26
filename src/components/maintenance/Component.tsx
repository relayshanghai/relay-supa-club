import Image from 'next/image';
import { type FC } from 'react';

type MaintenanceComponentProps = { message: string };

const MaintenanceComponent: FC<MaintenanceComponentProps> = ({ message }) => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="relative w-[620px] flex-col items-center justify-start gap-16 rounded-xl border-2 border-violet-600 bg-white shadow">
                <Image
                    className="absolute left-4 top-4"
                    src="/assets/imgs/logos/boostbot.svg"
                    width={25}
                    height={25}
                    alt="BoostBot Logo"
                />
                <div className="my-24 flex flex-col items-center justify-start gap-8 self-stretch px-8">
                    <div className="flex flex-col items-center justify-start gap-12 self-stretch">
                        <div className="flex flex-col items-center justify-start gap-6 self-stretch">
                            <div className="self-stretch text-center font-['Poppins'] text-xl font-normal text-slate-600">
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceComponent;
