'use client';

import { BoostbotSelected, Plus } from 'app/components/icons';
import { type GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from 'shadcn/components/ui/card';
import { truncatedText } from 'src/utils/outreach/helpers';
import { EmailTemplateWizardModal } from '../email-template-wizard-modal';
import { EmailTemplatePreview } from '../email-template-preview-modal';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import Skeleton from 'src/components/common/skeleton';

const NewTemplateCard = () => {
    return (
        <Card
            className="w-full border-2 border-gray-200 shadow-none lg:w-1/2 xl:min-w-[400px]"
            id="start-new-email-template"
        >
            <CardHeader className="flex flex-row items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                        <Plus height={18} width={18} className="stroke-primary-500 stroke-[3px]" />
                    </div>
                </div>
                <section className="flex flex-col items-start justify-between gap-4">
                    <CardTitle className="font-medium text-gray-700">Create a totally new template</CardTitle>
                    <CardDescription className="font-normal text-gray-400">
                        A blank canvas to call your own!
                    </CardDescription>
                </section>
            </CardHeader>
        </Card>
    );
};

const CustomTemplateCard = ({ emailTemplate }: { emailTemplate: GetTemplateResponse }) => {
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    return (
        <>
            <EmailTemplatePreview
                modalOpen={previewModalOpen}
                setModalOpen={(open) => setPreviewModalOpen(open)}
                emailTemplate={emailTemplate}
            />
            <Card
                className={`w-full min-w-[350px] border-2 shadow-none hover:cursor-pointer ${
                    false ? 'border-primary-600' : 'border-gray-200'
                }`}
                onClick={() => setPreviewModalOpen(true)}
            >
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                            <BoostbotSelected height={18} width={18} />
                        </div>
                    </div>
                    <section className="flex flex-col items-start justify-between gap-4">
                        <CardTitle className={`${false ? 'text-primary-800' : 'text-gray-700'} font-medium`}>
                            {emailTemplate?.name}
                        </CardTitle>
                        <CardDescription
                            className={`${
                                false ? 'text-primary-400' : 'text-gray-400'
                            } overflow-hidden overflow-ellipsis text-start font-normal`}
                        >
                            {truncatedText(emailTemplate?.description || '', 30)}
                        </CardDescription>
                    </section>
                </CardHeader>
            </Card>
        </>
    );
};

export const TemplateTabContent = ({ templates }: { templates: GetTemplateResponse[] }) => {
    const [showTemplateWizard, setShowTemplateWizard] = useState<boolean>(false);
    const { isEdit, setIsEdit, setEmailTemplate, emailTemplateInitialState, loading } = useOutreachTemplate();
    useEffect(() => {
        if (isEdit) {
            setShowTemplateWizard(true);
        }
    }, [isEdit]);

    return (
        <>
            <EmailTemplateWizardModal
                modalOpen={showTemplateWizard}
                setModalOpen={(open) => {
                    setShowTemplateWizard(open);
                    setIsEdit(false);
                }}
            />

            <section className="max-h-[510px] divide-y-2 overflow-y-auto p-8">
                <div className="mb-6 grid max-h-[350px] grid-cols-1 gap-6 lg:grid-cols-2">
                    {loading ? (
                        <>
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </>
                    ) : (
                        templates.map((template) => <CustomTemplateCard key={template.id} emailTemplate={template} />)
                    )}
                </div>
                <div>
                    <section className="mt-4 pb-3">
                        <p className="text-xl font-semibold text-gray-600 placeholder-gray-600">Start fresh</p>
                        <p className="font-normal text-gray-500 placeholder-gray-500">
                            If you already have a template in mind
                        </p>
                    </section>
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => {
                            setEmailTemplate(emailTemplateInitialState.item);
                            setShowTemplateWizard(true);
                        }}
                    >
                        <NewTemplateCard />
                    </div>
                </div>
            </section>
        </>
    );
};
