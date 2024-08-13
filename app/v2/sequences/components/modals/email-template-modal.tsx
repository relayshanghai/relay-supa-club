import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';
import { Cross } from 'src/components/icons';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import type { GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { Modal } from 'app/components/modals';
import { OutreachTabIcon } from './components/template-tab-icon';
import { TemplateTabContent } from './components/template-tab-content';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import { getOutreachStepsTranslationKeys } from '../../common/outreach-step';

type EmailTemplateModalProps = {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
};

export const EmailTemplateModal: FC<EmailTemplateModalProps> = ({ modalOpen, setModalOpen }) => {
    const { t } = useTranslation();
    const { emailTemplates, getTemplates } = useOutreachTemplate();
    useEffect(() => {
        if (modalOpen) {
            getTemplates();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalOpen]);
    const groupedTemplateData = emailTemplates?.reduce((acc: { [key: string]: GetTemplateResponse[] }, template) => {
        const key = template.step;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(template as GetTemplateResponse);
        return acc;
    }, {});
    return (
        <Modal visible={modalOpen} onClose={(open) => setModalOpen(open)} padding={0} maxWidth="!w-[960px]">
            <div className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start rounded-lg bg-violet-50 shadow">
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setModalOpen(false)}>
                    <Cross className="flex h-6 w-6 fill-white stroke-white" />
                </div>

                <div
                    className="inline-flex items-start justify-between self-stretch rounded-t-lg bg-gradient-to-tr from-violet-900 to-violet-700 pl-8 pr-3 pt-4"
                    data-testid="modal-header"
                >
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start">
                        <div className="inline-flex w-[896px] items-start justify-between pb-3 pt-2">
                            <div className="relative flex h-[68px] shrink grow basis-0 flex-col items-start justify-between">
                                <p className="text-xl text-white">Email Template Library</p>
                                <p className="text-sm font-normal text-white">
                                    Create, view and update your templates here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* body start */}
                <Tabs defaultValue="OUTREACH" className="w-full">
                    <TabsList className="mt-5 w-full">
                        {OUTREACH_STATUSES.map((status) => (
                            <TabsTrigger
                                key={`tab-${status}`}
                                className="flex grow items-center gap-2 border-b-2 border-b-primary-200 py-2 font-normal"
                                value={status}
                            >
                                <OutreachTabIcon status={status} />
                                {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {OUTREACH_STATUSES.map((status) => (
                        <TabsContent key={`content-${status}`} value={status}>
                            <TemplateTabContent templates={groupedTemplateData?.[status] || []} />
                        </TabsContent>
                    ))}
                </Tabs>
                {/* body end */}
            </div>
        </Modal>
    );
};
