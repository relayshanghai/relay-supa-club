import { useTranslation } from 'react-i18next';
import { Card, CardDescription, CardHeader, CardTitle } from 'shadcn/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'shadcn/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';
import { BoostbotSelected, Plus } from 'src/components/icons';
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

const CustomTemplateCard = ({
    name,
    description,
    selected,
}: {
    name: string;
    description: string;
    selected?: boolean;
}) => {
    return (
        <Card className={`w-full min-w-[400px] border-2 ${selected ? 'border-primary-600' : 'border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                        <BoostbotSelected height={24} width={24} className="stroke-primary-500" />
                    </div>
                </div>
                <section className="flex flex-col justify-between gap-4">
                    <CardTitle className={`${selected && 'text-primary-800'}`}>{name}</CardTitle>
                    <CardDescription className={`${selected && 'text-primary-400'}`}>{description}</CardDescription>
                </section>
            </CardHeader>
        </Card>
    );
};

const NewTemplateCard = () => {
    return (
        <Card className="w-fit min-w-[400px] border-2 border-gray-200">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                        <Plus height={24} width={24} className="stroke-primary-500 stroke-[3px]" />
                    </div>
                </div>
                <section className="flex flex-col justify-between gap-4">
                    <CardTitle>Create a totally new template</CardTitle>
                    <CardDescription>A blank canvas to call your own!</CardDescription>
                </section>
            </CardHeader>
        </Card>
    );
};

const TemplateTabContent = ({ status }: { status: OutreachStatus }) => {
    // const {
    //     data
    // } = useSWR([status], async () => {
    //     const res = await apiFetch('/api/outhreach/email-templates?step=${status}')
    //     return res.content;
    // })
    return (
        <section className="divide-y-2">
            <div className="my-4 grid max-h-[500px] grid-cols-2 gap-2 overflow-y-auto">
                <CustomTemplateCard name=";p;" description="lel" selected />
                <CustomTemplateCard name=";p;" description="lel" />
                <CustomTemplateCard name=";p;" description="lel" />
                <CustomTemplateCard name=";p;" description="lel" />
            </div>
            <div>
                <section className="py-2">
                    <p className="text-xl font-semibold text-gray-600">Start fresh</p>
                    <p className="font-normal text-gray-500">If you already have a template in mind</p>
                </section>
                <NewTemplateCard />
            </div>
        </section>
    );
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
                        <p className="text-xl">Email Template Library</p>
                        <p className="text-sm font-normal text-gray-500">Create, view and update your templates here</p>
                    </DialogTitle>
                    <DialogDescription className="w-full bg-primary-50 p-6 pt-0">
                        <CustomTemplateModalBody />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTemplateModal;
