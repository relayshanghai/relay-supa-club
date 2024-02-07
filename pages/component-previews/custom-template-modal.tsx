import { useTranslation } from 'react-i18next';
import { Button } from 'shadcn/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from 'shadcn/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'shadcn/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';
import {
    BoostbotSelected,
    ClockAnticlockwise,
    Compass,
    DeleteOutline,
    Edit,
    Plus,
    RingingBell,
} from 'src/components/icons';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

type Template = {
    id: number;
    name: string;
    description: string;
    subject: string;
    content: string;
};

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

const OutreachTabIcon = ({ status }: { status: OutreachStatus }) => {
    switch (status) {
        case 'OUTREACH':
            return <Compass className="h-3 w-4" />;
        case 'FIRST_FOLLOW_UP':
            return <RingingBell className="h-3 w-3" />;
        case 'SECOND_FOLLOW_UP':
            return <ClockAnticlockwise className="h-3 w-3" />;
        case 'THIRD_FOLLOW_UP':
            return <ClockAnticlockwise className="h-3 w-3" />;
        default:
            return <ClockAnticlockwise className="h-3 w-3" />;
    }
};

const CustomTemplateCard = ({
    template,
    status,
    selected,
}: {
    template: Template;
    status: OutreachStatus;
    selected?: boolean;
}) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Card
                    className={`w-full min-w-[350px] border-2 shadow-none ${
                        selected ? 'border-primary-600' : 'border-gray-200'
                    }`}
                >
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                                <BoostbotSelected height={24} width={24} />
                            </div>
                        </div>
                        <section className="flex flex-col items-start justify-between gap-4">
                            <CardTitle className={`${selected ? 'text-primary-800' : 'text-gray-700'} font-medium`}>
                                {template.name}
                            </CardTitle>
                            <CardDescription
                                className={`${selected ? 'text-primary-400' : 'text-gray-400'} font-normal`}
                            >
                                {template.description}
                            </CardDescription>
                        </section>
                    </CardHeader>
                </Card>
            </DialogTrigger>
            <DialogContent className="p-0">
                <DialogHeader>
                    <DialogDescription className="w-full p-6">
                        <CustomTemplateDetails status={status} subject={template.subject} content={template.content} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const CustomTemplateDetails = ({
    status,
    subject,
    content,
}: {
    status: OutreachStatus;
    subject: string;
    content: string;
}) => {
    const { t } = useTranslation();
    return (
        <Card className="w-full gap-2 border-none shadow-none">
            <CardDescription>
                <section className="flex gap-6 py-2">
                    <section className="flex flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Sequence Step</p>

                        <label className="min-w-[100px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-semibold  text-gray-500">
                            {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                        </label>
                    </section>
                    <section className="flex flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                        <label className="min-w-[300px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-normal text-gray-500">
                            {subject}
                        </label>
                    </section>
                </section>
                <section className="min-h-[200px] min-w-[400px] cursor-default rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
                    {content}
                </section>
            </CardDescription>
            <CardFooter className="mt-4 w-full justify-between px-0 pb-0">
                <Button variant="outline">
                    <DeleteOutline className="h-4 w-4 stroke-red-500" />
                </Button>
                <Button className="flex gap-4">
                    <Edit className="h-4 w-4 stroke-white" />
                    Modify Template
                </Button>
            </CardFooter>
        </Card>
    );
};

const NewTemplateCard = () => {
    return (
        <Card className="w-full border-2 border-gray-200 shadow-none lg:w-1/2 xl:min-w-[400px]">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                        <Plus height={24} width={24} className="stroke-primary-500 stroke-[3px]" />
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

const TemplateTabContent = ({ status }: { status: OutreachStatus }) => {
    // const {
    //     data
    // } = useSWR([status], async () => {
    //     const res = await apiFetch('/api/outhreach/email-templates?step=${status}')
    //     return res.content;
    // })
    const mockData = [
        {
            id: 1,
            name: 'Template 1',
            description: 'This is a template',
            subject: 'Email Subject 1',
            content: 'Email content',
        },
        {
            id: 2,
            name: 'Template 2',
            description: 'This is a template',
            subject: 'Email Subject 2',
            content: 'Email content',
        },
        {
            id: 3,
            name: 'Template 3',
            description: 'This is a template',
            subject: 'Email Subject',
            content: 'Email content',
        },
        {
            id: 4,
            name: 'Template 4',
            description: 'This is a template',
            subject: 'Email Subject',
            content: 'Email content',
        },
    ];

    return (
        <section className="divide-y-2">
            <div className="my-4 grid max-h-[350px] grid-cols-1 gap-2 overflow-y-auto lg:grid-cols-2">
                {mockData.map((template) => (
                    <CustomTemplateCard key={template.id} template={template} status={status} />
                ))}
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
            <DialogContent className="min-h-[90vh] min-w-[500px] p-0 md:min-w-[800px] xl:min-w-[1240px]">
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-1 p-6 pb-0">
                        <p className="text-xl">Email Template Library</p>
                        <p className="text-sm font-normal text-gray-500">Create, view and update your templates here</p>
                    </DialogTitle>
                    <DialogDescription className="h-full w-full bg-primary-50 p-6 pt-0">
                        <CustomTemplateModalBody />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTemplateModal;
