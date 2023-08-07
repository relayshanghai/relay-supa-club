import { useTranslation } from 'react-i18next';
import { Modal } from './modal';
import { Button } from './button';
import { InfoIcon } from './icons';
import { useState } from 'react';

export const AddToSequenceModal = ({ show, setShow }: { show: boolean; setShow: (show: boolean) => void }) => {
    const [selectedSequence, setSelectedSequence] = useState('');
    const { i18n, t } = useTranslation();
    const handleAddToSequence = () => {
        // TODO: add to sequence call
        //eslint-disable-next-line
        console.log(selectedSequence);
        //TODO: add toaster for success and error
    };

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
                        <div className="mb-2 font-semibold text-gray-800">{t('creators.sequence')}</div>
                        <select
                            data-testid="sequence-dropdown"
                            onChange={(e) => setSelectedSequence(e.target.value)}
                            value={selectedSequence || ''}
                            className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none"
                        >
                            <option>General collaboration sequence</option>
                            <option>Sequence name placeholder 2</option>
                        </select>
                    </div>

                    <div className="flex items-start rounded-md bg-blue-50 p-4">
                        <InfoIcon className="mr-4 mt-1 box-border h-4 w-4 flex-none text-blue-500" />
                        <div className="text-gray-500">
                            {t('creators.addToSequenceNotes')} {new Date().toLocaleDateString(i18n.language)}{' '}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-6">
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        {t('creators.cancel')}
                    </Button>
                    <Button onClick={() => handleAddToSequence()} type="submit">
                        {t('creators.addToSequence')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
