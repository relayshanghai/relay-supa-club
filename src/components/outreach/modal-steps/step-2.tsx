/* eslint-disable react-hooks/exhaustive-deps */

import { Input } from 'src/components/input';
import { Switch } from 'shadcn/components/ui/switch';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import { type ModalStepProps } from '../create-campaign-modal';

export const CampaignModalStepTwo: FC<ModalStepProps> = ({ onNextStep, onPrevStep }) => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full justify-center" data-testid="step2-outreach-form">
            <div className="mt-20 inline-flex h-[366px] w-[512px] flex-col items-start justify-start rounded-2xl bg-white p-3 shadow">
                <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                    <div className="flex h-[30px] shrink grow basis-0 items-start justify-start gap-1">
                        <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                            Set up your new sequence
                        </div>
                    </div>
                </div>
                <div className="relative flex h-72 flex-col items-start justify-start gap-12 self-stretch px-6 pb-4 pt-5">
                    <div className="flex h-[164px] flex-col items-start justify-start gap-4 self-stretch">
                        <div className="flex h-[164px] flex-col items-start justify-start gap-4 self-stretch">
                            <div className="flex h-[164px] flex-col items-start justify-start gap-6 self-stretch">
                                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                                        <Input
                                            label="Sequence Name"
                                            type="text"
                                            value={''}
                                            onChange={() => null}
                                            placeholder={'eg. Mavic Pro 3 Black Friday Camping Niche'}
                                            data-testid="sequence-name-input"
                                        />
                                    </div>
                                </div>
                                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                                        <Input
                                            label="Product"
                                            type="text"
                                            value={''}
                                            onChange={() => null}
                                            placeholder={'eg. Mavic Pro 3'}
                                            data-testid="sequence-name-input"
                                        />
                                    </div>
                                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-end gap-1">
                                        <div className="inline-flex items-start justify-start gap-1">
                                            <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-500">
                                                Auto-Start
                                            </div>
                                            <div className="relative h-3 w-3" />
                                        </div>
                                        <div className="inline-flex h-10 items-center justify-start gap-1 self-stretch">
                                            <Switch />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => onPrevStep()}
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            onClick={() => onNextStep()}
                        >
                            <span className="ml-1">{t('outreaches.saveAndContinue')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
