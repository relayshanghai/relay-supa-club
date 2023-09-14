import { useEffect, useRef, useState } from 'react';
import { Modal } from 'src/components/modal';
import { useRudderstack } from 'src/hooks/use-rudderstack';

interface VideoPreviewWithModalProps {
    eventToTrack: string;
    videoUrl: string;
}

export const VideoPreviewWithModal: React.FC<VideoPreviewWithModalProps> = ({ videoUrl, eventToTrack }) => {
    const { trackEvent } = useRudderstack();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!isModalOpen && videoRef.current) {
            videoRef.current.play();
        }
    }, [isModalOpen]);

    const openModal = () => {
        trackEvent(eventToTrack);
        setIsModalOpen(true);

        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <video ref={videoRef} className="cursor-pointer" src={videoUrl} autoPlay muted onClick={openModal} />

            <Modal visible={isModalOpen} onClose={closeModal} maxWidth="max-w-4xl">
                <video src={videoUrl} autoPlay muted />
            </Modal>
        </>
    );
};
