import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import guidePage from 'i18n/en/guide';
import Link from 'next/link';
import { Button } from '../button';

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

    const selectedGuide = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];

    return (
        <Modal visible={show} onClose={() => setShow(false)} title={t(`guidePage.modalInfo.${section}.title`) || ''}>
            <div className="flex flex-col rounded-full">
                <p className="text-2xl font-semibold text-gray-500">{t(`guidePage.modalInfo.${section}.subtitle`)}</p>
                <p className="text-sm font-semibold text-gray-500">{t(`guidePage.modalInfo.${section}.description`)}</p>
                {Object.keys(selectedGuide['sections' as keyof typeof selectedGuide]).map((guideSection, index) => {
                    return (
                        <div key={index} className="mt-4 flex flex-col gap-2">
                            <p className="text-base font-semibold text-gray-700">
                                {t(
                                    `guidePage.modalInfo.${section}.sections.${guideSection}.title` as keyof typeof guidePage,
                                )}
                            </p>
                            <p className="font-regular text-sm text-gray-500">
                                {t(`guidePage.modalInfo.${section}.sections.${guideSection}.description`)}
                            </p>
                        </div>
                    );
                })}
                <div className="mt-4 flex gap-4">
                    <Link href={selectedGuide.url}>
                        <Button className="flex flex-row gap-3">{t(`guidePage.modalInfo.${section}.goto`)}</Button>
                    </Link>
                    <Button className="flex flex-row gap-3" onClick={() => setShow(false)}>
                        {t('guidePage.goBack')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
