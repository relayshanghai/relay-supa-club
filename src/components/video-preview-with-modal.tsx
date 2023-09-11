import { useState } from 'react';
import { Modal } from 'src/components/modal';
import { useRudderstack } from 'src/hooks/use-rudderstack';

interface VideoPreviewWithModalProps {
    eventToTrack: string;
    videoUrl: string;
}

export const VideoPreviewWithModal: React.FC<VideoPreviewWithModalProps> = ({ videoUrl, eventToTrack }) => {
    const { trackEvent } = useRudderstack();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        trackEvent(eventToTrack);
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
