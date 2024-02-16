import { useState, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import {
    Atom,
    BoostbotSelected,
    ClockAnticlockwise,
    Compass,
    DeleteOutline,
    Edit,
    Loudspeaker,
    Plus,
    Present,
    ProfileSilhouette,
    RingingBell,
    Rocket,
    ChevronDown,
} from 'src/components/icons';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import ProgressHeader from 'src/components/ProgressHeader';
import { SearchBar } from 'src/components/SearchBar';
import { Input } from 'shadcn/components/ui/input';
import { DialogClose } from 'shadcn/components/ui/dialog';
import { Tiptap } from 'src/components/tiptap';
import useSWR from 'swr';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { GetAllTemplateResponse, GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { truncatedText } from 'src/utils/outreach/helpers';

const VARIABLE_GROUPS = ['brand', 'product', 'collab', 'influencer', 'wildcards'];

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];
type VariableGroup = (typeof VARIABLE_GROUPS)[number];

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
            return <Compass className="h-4 w-4 stroke-2" />;
        case 'FIRST_FOLLOW_UP':
            return <RingingBell className="h-4 w-4" />;
        case 'SECOND_FOLLOW_UP':
            return <ClockAnticlockwise className="h-4 w-4" />;
        case 'THIRD_FOLLOW_UP':
            return <ClockAnticlockwise className="h-4 w-4" />;
        default:
            return <ClockAnticlockwise className="h-4 w-4" />;
    }
};

const VariableGroupIcon = ({ status }: { status: VariableGroup }) => {
    switch (status) {
        case 'brand':
            return <Loudspeaker className="exempt h-4 w-4" />;
        case 'product':
            return <Rocket className="exempt h-4 w-4" />;
        case 'collab':
            return <Present className="exempt h-4 w-4" />;
        case 'influencer':
            return <ProfileSilhouette className="exempt h-4 w-4" />;
        case 'wildcards':
            return <Atom className="exempt h-4 w-4" />;
        default:
            return <ClockAnticlockwise className="exempt h-4 w-4" />;
    }
};

const CustomTemplateCard = ({
    templateId,
    status,
    selected,
}: {
    templateId: string;
    status: OutreachStatus;
    selected?: boolean;
}) => {
    const { data: template } = useSWR([templateId], async () => {
        const url = `/api/outreach/email-templates/${templateId}`;
        const res = await apiFetch<GetTemplateResponse>(url);
        return res.content;
    });
    return (
        <Dialog>
            <DialogTrigger>
                <Card
                    className={`w-full min-w-[350px] border-2 shadow-none ${
                        selected ? 'border-primary-600' : 'border-gray-200'
                    }`}
                >
                    <CardHeader className="flex flex-row items-start gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                                <BoostbotSelected height={18} width={18} />
                            </div>
                        </div>
                        <section className="flex flex-col items-start justify-between gap-4">
                            <CardTitle className={`${selected ? 'text-primary-800' : 'text-gray-700'} font-medium`}>
                                {template?.name}
                            </CardTitle>
                            <CardDescription
                                className={`${
                                    selected ? 'text-primary-400' : 'text-gray-400'
                                } overflow-hidden overflow-ellipsis text-start font-normal`}
                            >
                                {truncatedText(template?.description || '', 30)}
                            </CardDescription>
                        </section>
                    </CardHeader>
                </Card>
            </DialogTrigger>
            <DialogContent className="min-w-[600px] p-0 lg:min-w-[800px]">
                <DialogHeader>
                    <DialogDescription className="w-full p-6">
                        <CustomTemplateDetails
                            status={status}
                            subject={template?.subject || ''}
                            content={template?.template || ''}
                        />
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
            <CardDescription className="flex flex-col gap-2">
                <section className="flex w-full justify-between gap-6 py-2">
                    <section className="flex grow flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Sequence Step</p>

                        <label className="min-w-[100px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-semibold  text-gray-500">
                            {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                        </label>
                    </section>
                    <section className="flex grow flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                        <label className="min-w-[300px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-normal text-gray-500">
                            {subject}
                        </label>
                    </section>
                </section>
                <section className="h-[200px] min-w-[400px] cursor-default overflow-y-auto rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
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

const EditCustomTemplateDetails = ({
    subject,
    status,
    content,
    onNextClick,
    onStatusChange,
}: {
    subject: string;
    status: OutreachStatus;
    content: string;
    onNextClick: () => void;
    onStatusChange: (status: OutreachStatus) => void;
}) => {
    const [subjectInput, setSubjectInput] = useState('');
    const { t } = useTranslation();
    return (
        <Card className="flex h-full w-full flex-col justify-between gap-2 border-none shadow-none">
            <CardDescription className="flex h-full flex-col gap-4">
                <section className="flex w-full justify-between gap-6">
                    <section className="flex grow flex-col gap-2">
                        <p className="whitespace-nowrap text-xl font-semibold text-gray-600">Sequence Step</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-600 shadow">
                                    {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                                    <ChevronDown className="h-4 w-4 stroke-gray-400" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {OUTREACH_STATUSES.map((status, index) => (
                                    <DropdownMenuItem
                                        className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} grow text-gray-700`}
                                        key={'dropdownitem-' + status}
                                        onSelect={() => {
                                            onStatusChange(status);
                                        }}
                                    >
                                        {t(`sequences.steps.${getOutreachStepsTranslationKeys(status)}`)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                    <section className="flex grow flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                        <Input
                            disabled={status !== 'OUTREACH'}
                            className="min-w-[300px] focus:border-primary-400 focus-visible:ring-primary-400 disabled:bg-gray-200"
                            placeholder={`${status !== 'OUTREACH' ? 'Re: ' : ''}${subject}`}
                            value={`${status !== 'OUTREACH' ? 'Re: ' : ''}${subjectInput}`}
                            onChange={(e) => {
                                setSubjectInput(e.target.value);
                            }}
                        />
                    </section>
                </section>
                <section className="h-full min-h-[200px] min-w-[400px] cursor-default rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
                    <Tiptap
                        description={content}
                        placeholder="email body"
                        onChange={() => {
                            //
                        }}
                        onSubmit={() => {
                            //
                        }}
                    />
                </section>
            </CardDescription>
            <CardFooter className="w-full justify-end px-0 pb-0">
                <DialogClose>
                    <Button className=" text-gray-400" variant="ghost">
                        Back
                    </Button>
                </DialogClose>
                <Button
                    className="flex gap-4"
                    onClick={(e) => {
                        onNextClick();
                        e.stopPropagation();
                    }}
                >
                    Next Step
                </Button>
            </CardFooter>
        </Card>
    );
};

const NewTemplateCard = () => {
    return (
        <Card className="w-full border-2 border-gray-200 shadow-none lg:w-1/2 xl:min-w-[400px]">
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

const EditableTemplateCard = () => {
    return (
        <Card className="h-fit w-full border-2 border-gray-200 shadow-none lg:w-1/2 xl:min-w-[400px]">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                        <BoostbotSelected height={18} width={18} />
                    </div>
                </div>
                <section className="flex flex-col items-start justify-between gap-4">
                    <CardTitle className="font-medium text-gray-700">
                        <input className="border-none focus:outline-none" placeholder="Create a totally new template" />
                    </CardTitle>
                    <CardDescription className="font-normal text-gray-400">
                        <input
                            className="border-none focus:outline-none"
                            placeholder="A blank canvas to call your own!"
                        />
                    </CardDescription>
                </section>
            </CardHeader>
        </Card>
    );
};

const NameTemplateBody = () => {
    return (
        <div className="flex h-full w-full flex-col gap-2">
            <p className="text-xl font-semibold text-gray-600">Name your template</p>
            <div>
                <p className="text-sm font-normal text-gray-500">
                    Give it a brief description so you can easily remember what it’s for.
                </p>
                <p className="text-sm font-normal text-gray-500">This is what it will look like on other pages</p>
            </div>
            <section className="flex h-full w-full items-center justify-center">
                <EditableTemplateCard />
            </section>
            <section className="flex justify-end gap-2">
                <DialogClose>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button>Save template</Button>
            </section>
        </div>
    );
};

const TemplateTabContent = ({ status, templates }: { status: OutreachStatus; templates: GetAllTemplateResponse[] }) => {
    return (
        <section className="divide-y-2">
            <div className="my-6 grid max-h-[350px] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
                {templates.map((template) => (
                    <CustomTemplateCard key={template.id} templateId={template.id} status={status} />
                ))}
            </div>
            <div>
                <section className="pb-3 pt-6">
                    <p className="text-xl font-semibold text-gray-600 placeholder-gray-600">Start fresh</p>
                    <p className="font-normal text-gray-500 placeholder-gray-500">
                        If you already have a template in mind
                    </p>
                </section>
                <NewTemplateCard />
            </div>
        </section>
    );
};

const CustomTemplateModalBody = () => {
    const { t } = useTranslation();
    const { data } = useSWR(['pah'], async () => {
        const res = await apiFetch<GetAllTemplateResponse[]>('/api/outreach/email-templates');
        return res.content;
    });
    const groupedTemplateData = data?.reduce((acc: { [key: string]: GetAllTemplateResponse[] }, template) => {
        const key = template.step;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(template);
        return acc;
    }, {});

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
                    <TemplateTabContent templates={groupedTemplateData?.[status] || []} status={status} />
                </TabsContent>
            ))}
        </Tabs>
    );
};

const VariableGroup = ({ variableGroup }: { variableGroup: { title: VariableGroup; variables: string[] } }) => {
    const { title, variables } = variableGroup;
    return (
        <AccordionItem value={'group-' + title}>
            <AccordionTrigger className="data-[state=open]:stroke-primary-600 data-[state=open]:text-primary-600">
                <section className="flex items-center gap-3">
                    <VariableGroupIcon status={title} />
                    <p>{title}</p>
                </section>
            </AccordionTrigger>

            <AccordionContent className="text-xs">
                {variables.map((variable, index) => (
                    <p
                        className={`flex cursor-pointer items-center gap-1 p-3 font-semibold ${
                            index % 2 !== 0 && 'bg-gray-50'
                        }`}
                        key={`variable-${title}-${variable}`}
                    >
                        {'{'}
                        <span className="font-semibold text-primary-600">{variable}</span>
                        {'}'}
                    </p>
                ))}
                <Dialog>
                    <DialogTrigger className="flex items-center gap-1 whitespace-nowrap p-3 font-semibold text-gray-400">
                        {'{'}
                        <Plus className="h-3 w-3 stroke-gray-400 stroke-[4px]" />
                        {'}'} Add new Brand variable
                    </DialogTrigger>
                    <DialogContent className="p-3 font-semibold text-gray-600">
                        <DialogHeader>
                            <DialogTitle className="flex flex-col gap-1 px-6 pt-6">
                                <p className="text-xl">Add a new variable</p>
                            </DialogTitle>
                            <DialogDescription className="flex gap-4 px-6">
                                <section className="flex w-full flex-col gap-2">
                                    <p className="">Category</p>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className="flex h-9 w-full flex-row items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-2 py-1 font-normal text-gray-600 shadow">
                                                <section className="flex items-center gap-2">
                                                    <VariableGroupIcon status={title} />
                                                    {title}
                                                </section>
                                                <ChevronDown className="h-4 w-4 stroke-gray-400" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {VARIABLE_GROUPS.map((group, index) => (
                                                <DropdownMenuItem
                                                    className={`${
                                                        index % 2 !== 0 && 'bg-gray-50'
                                                    } flex items-center gap-2`}
                                                    key={'dropdownitem-' + group}
                                                    onSelect={() => {
                                                        // onStatusChange(status);
                                                    }}
                                                >
                                                    <VariableGroupIcon status={group} />
                                                    {group}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </section>
                                <section className="flex flex-col gap-2">
                                    <p className="">Name</p>
                                    <section className="flex h-full items-center rounded-md border border-gray-200 bg-white p-1 shadow focus:border-primary-300">
                                        {'{'}
                                        <input
                                            placeholder="Enter variable name"
                                            className="focus-visible:ring-none px-1 text-primary-600 placeholder-primary-300 focus:border-transparent focus:outline-none"
                                        />
                                        {'}'}
                                    </section>
                                </section>
                            </DialogDescription>
                        </DialogHeader>
                        <section className="flex w-full justify-end">
                            <DialogClose>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button>Add new variable</Button>
                        </section>
                    </DialogContent>
                </Dialog>
            </AccordionContent>
        </AccordionItem>
    );
};

const mockVariables = [
    {
        title: 'brand',
        variables: ['brand_name', 'brand_website', 'brand_email', 'brand_phone'],
    },
    {
        title: 'product',
        variables: ['product_name', 'product_price', 'product_description'],
    },
    {
        title: 'collab',
        variables: ['collab_name', 'collab_email', 'collab_phone'],
    },
    {
        title: 'influencer',
        variables: ['influencer_name', 'influencer_email', 'influencer_phone'],
    },
    {
        title: 'wildcards',
        variables: ['first_name', 'last_name', 'email', 'phone'],
    },
];

const EditCustomTemplateModalBody = ({ onNextClick }: { onNextClick: () => void }) => {
    const [status, setStatus] = useState('OUTREACH' as OutreachStatus);
    const [variables, setVariables] = useState(mockVariables);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        if (searchTerm === '') {
            setVariables(mockVariables);
            return;
        }
        const fuse = new Fuse(mockVariables, {
            keys: ['title', 'variables'],
        });
        const results = fuse.search(searchTerm);
        setVariables(results.map((result) => result.item));
    }, [searchTerm]);
    return (
        <div className="flex h-full w-full divide-x-2 bg-white shadow-lg">
            <section className="basis-2/5 divide-y-2 pb-16">
                <section className="whitespace-nowrap p-3 text-lg font-semibold text-gray-700">
                    Template Variables
                </section>
                <section className="flex h-full flex-col gap-2 px-6 py-3">
                    <SearchBar
                        placeholder={'search for variables'}
                        onSearch={(searchTerm) => {
                            setSearchTerm(searchTerm);
                        }}
                    />
                    <div className="flex-auto justify-center overflow-auto" style={{ height: 2 }}>
                        <Accordion id={mockVariables[0].title} type="multiple">
                            {variables.map((group) => (
                                <VariableGroup key={'group-' + group} variableGroup={group} />
                            ))}
                        </Accordion>
                    </div>
                </section>
            </section>
            <section className="basis-4/5 px-9 py-3">
                <EditCustomTemplateDetails
                    status={status}
                    subject={'Subject'}
                    content={'BODY'}
                    onNextClick={onNextClick}
                    onStatusChange={(status) => {
                        setStatus(status);
                    }}
                />
            </section>
        </div>
    );
};

const CustomTemplateModal = () => {
    const [step, setStep] = useState(0);
    const progressStep = [
        {
            title: 'Choose a starting point',
            description: 'Starter or blank slate',
        },
        {
            title: 'Set template content',
            description: 'Subject and email body',
        },
        {
            title: 'Name your template',
            description: 'Name and brief description',
        },
    ];
    const handleNextClick = useCallback(() => {
        setStep(step + 1);
    }, [step]);
    return (
        <>
            <Dialog
                onOpenChange={(open) => {
                    open ? setStep(1) : setStep(0);
                }}
            >
                <DialogTrigger>Edit modal</DialogTrigger>
                <DialogContent className="min-h-[90vh] min-w-[500px] p-0 md:min-w-[800px] xl:min-w-[1240px]">
                    <DialogHeader>
                        <DialogTitle className="flex w-full flex-col gap-1 py-2">
                            <ProgressHeader labels={progressStep} selectedIndex={step} />
                        </DialogTitle>
                        <DialogDescription className="h-full w-full bg-primary-50 p-6">
                            {step === 1 ? (
                                <EditCustomTemplateModalBody onNextClick={handleNextClick} />
                            ) : (
                                <NameTemplateBody />
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger>
                    <Button>Template Library</Button>
                </DialogTrigger>
                <DialogContent className="min-h-[90vh] min-w-[500px] p-0 md:min-w-[800px] xl:min-w-[1240px]">
                    <DialogHeader>
                        <DialogTitle className="flex flex-col gap-1 px-6 py-4 pt-6">
                            <p className="text-xl text-gray-700">Email Template Library</p>
                            <p className="text-sm font-normal text-gray-500">
                                Create, view and update your templates here
                            </p>
                        </DialogTitle>
                        <DialogDescription className="h-full w-full bg-primary-50 p-6 pt-0">
                            <CustomTemplateModalBody />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CustomTemplateModal;
