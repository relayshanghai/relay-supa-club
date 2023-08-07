import { useTranslation } from 'react-i18next';
import { Modal } from './modal';
import { Button } from './button';
import { InfoIcon } from './icons';

export const AddToSequenceModal = ({
    show,
    setShow,
}: // platform,
// selectedCreator,
{
    show: boolean;
    setShow: (show: boolean) => void;
    // platform: CreatorPlatform;
    // selectedCreator: CreatorUserProfile | null;
}) => {
    const { i18n, t } = useTranslation();

    return (
        <Modal
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <div>
                <div className="space-y-4 p-6">
                    <div>
                        <div className="font-semibold text-gray-800">{t('creators.sequence')}</div>
                        <div>dropdown select</div>
                    </div>
                    <div className="flex items-start rounded-md bg-blue-50 p-4">
                        <InfoIcon className="mr-4 mt-1 box-border h-4 w-4 flex-none text-blue-500" />
                        <div className="text-gray-500">
                            {t('creators.addToSequenceNotes')} {new Date().toLocaleDateString(i18n.language)}{' '}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-6">
                    <Button variant="secondary">{t('creators.cancel')}</Button>
                    <Button>{t('creators.addToSequence')}</Button>
                </div>
            </div>
        </Modal>
    );
};
