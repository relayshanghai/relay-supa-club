'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardDescription, CardFooter } from 'shadcn/components/ui/card';
import { Button } from 'shadcn/components/ui/button';
import { DeleteOutline, Edit } from 'app/components/icons';
import { getOutreachStepsTranslationKeys } from '../../common/outreach-step';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from 'shadcn/components/ui/dialog';
import { type GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { type Nullable } from 'types/nullable';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import { useEffect, useState } from 'react';
import { Skeleton } from 'shadcn/components/ui/skeleton';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
import { convertTiptapVariableToComponent } from '../utils';

export const EmailTemplatePreview = ({
    modalOpen,
    setModalOpen,
    emailTemplate,
}: {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
    emailTemplate: Nullable<GetTemplateResponse>;
}) => {
    const { t } = useTranslation();
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const { getTemplate, loading, setIsEdit, deleteTemplate } = useOutreachTemplate();
    const [template, setTemplate] = useState<Nullable<GetTemplateResponse>>(null);

    useEffect(() => {
        if (emailTemplate && modalOpen) {
            getTemplate(emailTemplate.id).then((data) => setTemplate(data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailTemplate?.id, modalOpen]);

    const deleteHandler = () => {
        deleteTemplate(emailTemplate?.id as string).then(() => {
            setModalOpen(false);
        });
    };

    return (
        <>
            <ConfirmModal
                deleteHandler={() => deleteHandler()}
                setShow={(show) => setOpenConfirmModal(show)}
                show={openConfirmModal}
                cancelHandler={() => setModalOpen(true)}
            />
            <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <DialogContent className="min-w-[600px] p-0 lg:min-w-[800px]">
                    <DialogHeader>
                        <DialogDescription className="w-full p-6">
                            <Card className="w-full gap-2 border-none shadow-none">
                                <CardDescription className="flex flex-col gap-2">
                                    <section className="flex w-full justify-between gap-6 py-2">
                                        <section className="flex grow flex-col gap-2">
                                            <p className="text-xl font-semibold text-gray-600">Sequence Step</p>
                                            {loading ? (
                                                <Skeleton className="h-10 min-w-[100px]" />
                                            ) : (
                                                <label className="min-w-[100px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-semibold  text-gray-500">
                                                    {template?.step &&
                                                        t(
                                                            `sequences.steps.${getOutreachStepsTranslationKeys(
                                                                template?.step,
                                                            )}`,
                                                        )}
                                                </label>
                                            )}
                                        </section>
                                        <section className="flex grow flex-col gap-2">
                                            <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                                            {loading ? (
                                                <Skeleton className="h-10 w-full" />
                                            ) : (
                                                <label
                                                    className="min-w-[300px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-normal text-gray-500"
                                                    dangerouslySetInnerHTML={{
                                                        __html: convertTiptapVariableToComponent(
                                                            template?.subject ?? '',
                                                        ),
                                                    }}
                                                />
                                            )}
                                        </section>
                                    </section>
                                    {loading ? (
                                        <Skeleton className="h-[200px] min-w-[400px]" />
                                    ) : (
                                        <section
                                            className="h-[200px] min-w-[400px] cursor-default overflow-y-auto rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500"
                                            dangerouslySetInnerHTML={{
                                                __html: convertTiptapVariableToComponent(template?.template ?? ''),
                                            }}
                                        />
                                    )}
                                </CardDescription>
                                {!loading && (
                                    <CardFooter className="mt-4 w-full justify-between px-0 pb-0">
                                        <Button
                                            variant="outline"
                                            className="[&>svg]:hover:stroke-white"
                                            onClick={() => {
                                                setOpenConfirmModal(true);
                                                setModalOpen(false);
                                            }}
                                        >
                                            <DeleteOutline className="h-4 w-4 stroke-red-500" />
                                        </Button>
                                        <Button
                                            type="button"
                                            className="flex gap-4"
                                            onClick={() => {
                                                setModalOpen(false);
                                                setIsEdit(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4 stroke-white" />
                                            Modify Template
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};
