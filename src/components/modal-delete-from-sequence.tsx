import { ModalWithButtons } from './modal-with-buttons';

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
    return (
        <ModalWithButtons
            title="Confirm Delete?"
            visible={show}
            onClose={() => {
                setShow(false);
            }}
            closeButtonText="Go back"
            okButtonText="Confirm delete"
            onOkay={() => {
                setShow(false);
                deleteInfluencer(sequenceId);
            }}
        >
            <div className="flex flex-col gap-2">
                <p>Sure you wanna delete?</p>
            </div>
        </ModalWithButtons>
    );
};
