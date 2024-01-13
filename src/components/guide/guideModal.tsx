import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import guidePage from 'i18n/en/guide';
import Link from 'next/link';
import { Button } from '../button';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { GUIDE_PAGE } from 'src/utils/rudderstack/event-names';
import { CloseHelpModal } from 'src/utils/analytics/events';

export const GuideModal = ({
    section,
    show,
    setShow,
}: {
    section: keyof (typeof guidePage)['modalInfo'];
    show: boolean;
    setShow: (open: boolean) => void;
}) => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();

    const selectedGuide = guidePage.modalInfo[section];

    return (
        <Modal
            visible={show}
            maxWidth={`max-w-3xl`}
            onClose={() => {
                track(CloseHelpModal, {
                    type: 'Guide Section',
                    modal_name: 'GuideModal',
                    method: 'Off Modal Click',
                });
                setShow(false);
            }}
            title={t(`guidePage.modalInfo.${section}.title`) || ''}
        >
            <div className="flex flex-col rounded-full">
                <div className="max-h-[50vh] overflow-y-auto lg:max-h-[70vh]">
                    {selectedGuide.sections.map((guideSection, index) => {
                        return (
                            <div key={index} className="mt-6 flex flex-col gap-2">
                                {t(`guidePage.modalInfo.${section}.sections.${index}.title`) !== '' && (
                                    <p className="text-xl font-semibold text-gray-700">
                                        {t(`guidePage.modalInfo.${section}.sections.${index}.title`)}
                                    </p>
                                )}
                                <p className="font-regular text-sm text-gray-500">
                                    {t(`guidePage.modalInfo.${section}.sections.${index}.description`)}
                                </p>
                                {'demo' in guideSection && (
                                    <img
                                        className="rounded-xl"
                                        alt="Demo GIF"
                                        src={`/assets/videos/${guideSection.demo}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        className="flex cursor-pointer flex-row items-center gap-2 text-sm font-medium text-primary-700"
                        onClick={() => {
                            track(CloseHelpModal, {
                                type: 'Guide Section',
                                modal_name: 'Guide',
                                method: 'Button',
                            });
                            setShow(false);
                        }}
                    >
                        {t('guidePage.goBack')}
                    </button>
                    <Link
                        onClick={() => {
                            trackEvent(GUIDE_PAGE('navigate to page'), { guideSection: section });
                        }}
                        href={selectedGuide.url}
                    >
                        <Button className="flex flex-row gap-3">
                            {t(`guidePage.goto`) + ' ' + t(`guidePage.modalInfo.${section}.title`)}
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};
