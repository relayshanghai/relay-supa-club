import { Cross } from '../icons';
import { Modal } from '../modal';
import CampaignModalStepOne from './modal-steps/step-1';
import { ModalHeader } from './create-campaign-modal-header';

export const CreateCampaignModal = ({
    showCreateCampaignModal,
    setShowCreateCampaignModal,
}: {
    title: string;
    showCreateCampaignModal: boolean;
    setShowCreateCampaignModal: (showCreateCampaignModal: boolean) => void;
}) => {
    return (
        <Modal visible={showCreateCampaignModal} onClose={() => null} padding={0} maxWidth="!w-[960px]">
            <div className="rounded-lg">
                <div className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start shadow">
                    <div
                        className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer"
                        onClick={() => setShowCreateCampaignModal(false)}
                    >
                        <Cross className="flex h-6 w-6 fill-white stroke-white" />
                    </div>
                    <ModalHeader step="1" />
                    {/* body start */}
                    <CampaignModalStepOne setModalOpen={(v) => setShowCreateCampaignModal(v)} />
                    {/* body end */}
                </div>
            </div>
        </Modal>
    );
};
