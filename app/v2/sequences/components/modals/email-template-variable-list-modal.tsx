import { useEffect, type FC } from 'react';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { Cross } from 'app/components/icons';
import { Modal } from 'app/components/modals';
import { VariableTable } from '../variable-table/variable-table';
import { useTranslation } from 'react-i18next';
import { GlobalTemplateVariables } from 'src/backend/domain/templates/constants';

export type ModalVariableProps = {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
};

export const ListVariableModal: FC<ModalVariableProps> = ({ modalOpen, setModalOpen }) => {
    const { t } = useTranslation();
    const { loading, getTemplateVariables, templateVariables } = useOutreachTemplateVariable();

    useEffect(() => {
        getTemplateVariables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalOpen]);

    return (
        <Modal visible={modalOpen} onClose={() => null} padding={0} maxWidth="!w-[960px]">
            <div
                className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start rounded-lg bg-white"
                id="template-variable-modal"
            >
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setModalOpen(false)}>
                    <Cross className="flex h-6 w-6 fill-gray-400 stroke-white" />
                </div>

                {/* title section */}
                <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <div className="inline-flex items-start justify-start gap-1">
                            <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                                {t('outreaches.variableModal.variableList')}
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex w-6 flex-col items-end justify-start gap-2.5 self-stretch">
                        <div className="relative h-6 w-6" />
                    </div>
                </div>
                {/* title section */}

                {/* form section */}
                <div className="mt-6 flex h-auto flex-col items-start justify-start gap-3 self-stretch overflow-y-scroll px-6 pb-8">
                    <VariableTable
                        items={templateVariables.filter((f) => {
                            // ignore global variables
                            return !GlobalTemplateVariables.some((d) => d.id === f.id);
                        })}
                        loading={loading}
                    />
                </div>
                {/* form section */}
            </div>
        </Modal>
    );
};
