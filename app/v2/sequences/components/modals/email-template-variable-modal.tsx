import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { ChevronDown } from 'src/components/icons';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { clientLogger } from 'src/utils/logger-client';
import { Cross } from 'app/components/icons';
import { Modal } from 'app/components/modals';
import { Input } from 'app/components/inputs';
import { Button } from 'app/components/buttons';
import { variableCategories } from '../utils';

export type ModalVariableProps = {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
};

export const CreateVariableModal: FC<ModalVariableProps> = ({ modalOpen, setModalOpen }) => {
    const { t } = useTranslation();
    const { createTemplateVariable, loading, getTemplateVariables } = useOutreachTemplateVariable();
    const [inputValues, setInputValues] = useState({
        category: 'Brand',
        name: '',
    });
    const saveTemplateVariable = () => {
        createTemplateVariable(inputValues)
            .then(() => getTemplateVariables())
            .then(() => setInputValues({ category: 'Brand', name: '' }))
            .catch((error) => {
                clientLogger(error);
            });
    };
    return (
        <Modal visible={modalOpen} onClose={() => null} padding={0} maxWidth="!w-[512px]">
            <div className="relative inline-flex h-auto w-[523px] flex-col items-start justify-start rounded-lg bg-white">
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setModalOpen(false)}>
                    <Cross className="flex h-6 w-6 fill-gray-400 stroke-white" />
                </div>

                {/* title section */}
                <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <div className="inline-flex items-start justify-start gap-1">
                            <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                                Add a new variable
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex w-6 flex-col items-end justify-start gap-2.5 self-stretch">
                        <div className="relative h-6 w-6" />
                    </div>
                </div>
                {/* title section */}

                {/* form section */}
                <div className="mt-6 flex h-auto flex-col items-start justify-start gap-3 self-stretch px-6">
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <div className="text-sm font-medium text-gray-700">Category</div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="mt-1 flex w-full">
                                    <section className="flex h-9 w-full flex-shrink-0 flex-grow-0 items-center justify-between gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
                                        <span className="text-sm font-normal text-gray-400">
                                            {inputValues.category}
                                        </span>{' '}
                                        <ChevronDown className="h-4 w-4 text-black" />
                                    </section>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[210px]">
                                    {variableCategories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.name}
                                            onSelect={() => {
                                                setInputValues({ ...inputValues, category: category.name });
                                            }}
                                            className="flex w-full"
                                        >
                                            {category.icon}
                                            {category.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                label={'Variable Name'}
                                type="text"
                                value={inputValues.name}
                                onChange={(e) => {
                                    setInputValues({ ...inputValues, name: e.target.value });
                                }}
                                placeholder={'Enter Variable Name'}
                                data-testid="variable-name-input"
                            />
                        </div>
                    </div>
                </div>
                {/* form section */}

                {/* submit button section */}
                <div className="flex h-[84px] flex-col items-end justify-center gap-6 self-stretch p-6">
                    <div className="inline-flex h-9 items-start justify-start gap-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => setModalOpen(false)}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className={`inline-flex items-center border-none !${
                                loading ? 'bg-pink-300' : 'bg-pink-500'
                            } !p-2`}
                            data-testid="next-button"
                            onClick={() => saveTemplateVariable()}
                            disabled={loading}
                        >
                            {t('outreaches.saveAndContinue')}
                        </Button>
                    </div>
                </div>
                {/* submit button section */}
            </div>
        </Modal>
    );
};