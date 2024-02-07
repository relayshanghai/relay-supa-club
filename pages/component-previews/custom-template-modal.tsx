import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'shadcn/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

const getOutreachStepsTranslationKeys = (status: OutreachStatus) => {
    switch (status) {
        case 'OUTREACH':
            return 'Outreach';
        case 'FIRST_FOLLOW_UP':
            return '1st Follow-up';
        case 'SECOND_FOLLOW_UP':
            return '2nd Follow-up';
        case 'THIRD_FOLLOW_UP':
            return '3rd Follow-up';
        default:
            break;
    }
};

const TemplateTabContent = ({ status }: { status: OutreachStatus }) => {
    // const {
    //     data
    // } = useSWR([status], async () => {
    //     const res = await apiFetch('/api/outhreach/email-templates?step=${status}')
    //     return res.content;
    // })
    return <>{status}: Make changes to your account here.</>;
};

const CustomTemplateModalBody = () => {
    const { t } = useTranslation();
    return (
        <Tabs defaultValue="OUTREACH" className="w-full">
            <TabsList className="w-full">
                {OUTREACH_STATUSES.map((status) => (
                    <TabsTrigger key={`tab-${status}`} className="grow font-normal" value={status}>
                        {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                    </TabsTrigger>
                ))}
            </TabsList>
            {OUTREACH_STATUSES.map((status) => (
                <TabsContent key={`content-${status}`} value={status}>
                    <TemplateTabContent status={status} />
                </TabsContent>
            ))}
        </Tabs>
    );
};

const CustomTemplateModal = () => {
    return (
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className="p-0">
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-1 p-6 pb-0">
                        <p>Email Template Library</p>
                        <p className="text-sm font-normal text-gray-500">Create, view and update your templates here</p>
                    </DialogTitle>
                    <DialogDescription className="bg-primary-50 p-6 pt-0">
                        <CustomTemplateModalBody />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTemplateModal;
