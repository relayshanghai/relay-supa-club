import { useState } from 'react';
import { Modal } from 'src/components/modal';

interface VideoPreviewWithModalProps {
    videoUrl: string;
}

export const VideoPreviewWithModal: React.FC<VideoPreviewWithModalProps> = ({ videoUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <video className="cursor-pointer" src={videoUrl} autoPlay muted onClick={openModal} />

            <Modal visible={isModalOpen} onClose={closeModal} maxWidth="max-w-4xl">
                <video src={videoUrl} autoPlay muted />
            </Modal>
        </>
    );
};
