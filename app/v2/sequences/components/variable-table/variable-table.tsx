'use client';
import { Button } from 'app/components/buttons';
import { Edit, Trashcan } from 'app/components/icons';
import { useState } from 'react';
import { CreateVariableModal } from '../modals/email-template-variable-modal';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
import toast from 'react-hot-toast';

export interface VariableTableProps {
    loading?: boolean;
    items: OutreachEmailTemplateVariableEntity[];
}
export function VariableTable({ items, loading }: Readonly<VariableTableProps>) {
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const { setIsEdit, setTemplateVariable, deleteTemplateVariable, templateVariable, getTemplateVariables } =
        useOutreachTemplateVariable();
    const handleDeleteVariable = () =>
        deleteTemplateVariable(templateVariable?.id as string)
            .then(() => setOpenConfirmModal(false))
            .then(() => getTemplateVariables())
            .then(() => toast.success('Template variable deleted successfully'))
            .catch(() => toast.error('Failed to delete template variable'));
    return (
        <>
            <ConfirmModal
                deleteHandler={() => handleDeleteVariable()}
                setShow={(show) => setOpenConfirmModal(show)}
                show={openConfirmModal}
            />
            <CreateVariableModal modalOpen={showVariableModal} setModalOpen={(open) => setShowVariableModal(open)} />
            <div className={`relative w-full overflow-x-auto sm:rounded-lg  ${loading && 'animate-pulse'}`}>
                <div className="mb-4 flex w-full items-end justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowVariableModal(true);
                            setIsEdit(false);
                            setTemplateVariable(null);
                        }}
                        className="flex"
                    >
                        Add template Variable
                    </Button>
                </div>
                <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((variable) => (
                            <tr
                                key={variable.id}
                                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                            >
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                >
                                    {variable.name}
                                </th>
                                <td className="px-6 py-4">{variable.category}</td>
                                <td className="flex gap-1 px-6 py-4">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="flex"
                                        onClick={() => {
                                            setIsEdit(true);
                                            setShowVariableModal(true);
                                            setTemplateVariable(variable);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 stroke-white" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="flex"
                                        onClick={() => {
                                            setTemplateVariable(variable);
                                            setOpenConfirmModal(true);
                                        }}
                                    >
                                        <Trashcan className="relatives h-5 w-5" fill="red" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
