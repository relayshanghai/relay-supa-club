import { CheckIcon, Cross } from '../icons';
import { Modal } from '../modal';
import { Input } from '../input';
import { Button } from '../button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    type OutreachEmailTemplateEntity,
    type Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';

export const EmailTemplateDetailModal = ({
    showEmailTemplateDetailModal,
    setShowEmailTemplateDetailModal,
    data,
}: {
    showEmailTemplateDetailModal: boolean;
    setShowEmailTemplateDetailModal: (showEmailTemplateDetailModal: boolean) => void;
    data: OutreachEmailTemplateEntity & { step: Step };
}) => {
    return (
        <Modal
            visible={showEmailTemplateDetailModal}
            onClose={() => setShowEmailTemplateDetailModal(false)}
            padding={0}
            maxWidth="!w-[575px]"
        >
            <div className="rounded-lg">
                <div className="relative flex min-h-[250px] w-[575px] flex-col items-start justify-start p-[24px] shadow">
                    <div
                        className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer"
                        onClick={() => setShowEmailTemplateDetailModal(false)}
                    >
                        <Cross className="flex h-6 w-6 fill-gray-500 stroke-white" />
                    </div>
                    {/* body start */}
                    <div className="flex w-full gap-6">
                        <div className="w-[200px]">
                            <Input label="Sequence Name" type="text" value={data?.step} onChange={() => null} />
                        </div>
                        <div className="w-[300px]">
                            <Input label="Subject Line" type="text" value={data?.name ?? ''} onChange={() => null} />
                        </div>
                    </div>
                    <div className="flex w-full gap-6">
                        <textarea className="min-h-[200px] w-full rounded-md" name="template" id="template">
                            {data?.template}
                        </textarea>
                    </div>
                    <div className="mt-4 flex w-full justify-between ">
                        <Button type="button" variant="secondary" className="!border-red-500 !p-2">
                            <TrashIcon className="h-4 w-4 stroke-red-600" />
                        </Button>
                        <div className="flex justify-center space-x-2">
                            <Button type="button" variant="secondary" className="inline-flex !border-violet-600 !p-2">
                                <PencilSquareIcon className="mr-1 h-4 w-4 stroke-violet-600" />{' '}
                                <span>Modify Template</span>
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            >
                                {'{'}
                                <CheckIcon className="h-4 w-4 stroke-white" />
                                {'}'} <span className="ml-1">Use in sequence</span>
                            </Button>
                        </div>
                    </div>
                    {/* body end */}
                </div>
            </div>
        </Modal>
    );
};
