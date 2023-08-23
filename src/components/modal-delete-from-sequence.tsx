import { useState } from 'react';
import { ModalWithButtons } from './modal-with-buttons';
import { Spinner } from './icons';

export const DeleteFromSequenceModal = ({
    show,
    setShow,
    deleteInfluencer,
    sequenceId,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    deleteInfluencer: (id: string) => void;
    sequenceId: string;
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <ModalWithButtons
            title="Delete influencer from sequence?"
            visible={show}
            onClose={() => {
                setShow(false);
            }}
            closeButtonText="Cancel"
            okButtonText={loading ? <Spinner className="h-5 w-5 fill-primary-500 text-white" /> : 'Yes, delete them'}
            onOkay={async () => {
                setLoading(true);
                await deleteInfluencer(sequenceId);
                setLoading(false);
                setShow(false);
            }}
        >
            <p className="mb-6 mt-4">
                Deleting the influencer will remove them from the sequence, and cancel any future messages. {`You'll`}{' '}
                have to re-add them if you change your mind.
            </p>
        </ModalWithButtons>
    );
};
