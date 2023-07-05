import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import guidePage from 'i18n/en/guide';
import Link from 'next/link';
import { Button } from '../button';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { GUIDE_PAGE } from 'src/utils/rudderstack/event-names';

export const GuideModal = ({
    section,
    show,
    setShow,
}: {
    section: string;
    show: boolean;
    setShow: (open: boolean) => void;
}) => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const selectedGuide = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];

    return (
        <Modal
            visible={show}
            maxWidth={`max-w-xl`}
            onClose={() => setShow(false)}
            title={t(`guidePage.modalInfo.${section}.title`) || ''}
        >
            <div className="flex flex-col rounded-full">
                {Object.keys(selectedGuide['sections' as keyof typeof selectedGuide]).map((guideSection, index) => {
                    return (
                        <div key={index} className="mt-6 flex flex-col gap-2">
                            {t(`guidePage.modalInfo.${section}.sections.${guideSection}.title`) !== '' && (
                                <p className="text-xl font-semibold text-gray-700">
                                    {t(`guidePage.modalInfo.${section}.sections.${guideSection}.title`)}
                                </p>
                            )}
                            <p className="font-regular text-sm text-gray-500">
                                {t(`guidePage.modalInfo.${section}.sections.${guideSection}.description`)}
                            </p>
                        </div>
                    );
                })}
                <div className="mt-8 flex justify-end gap-4">
                    <p
                        className="flex cursor-pointer flex-row items-center gap-2 text-sm font-medium text-primary-700"
                        onClick={() => {
                            trackEvent(GUIDE_PAGE('closed modal'), { guideSection: section });
                            setShow(false);
                        }}
                    >
                        {t('guidePage.goBack')}
                    </p>
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
