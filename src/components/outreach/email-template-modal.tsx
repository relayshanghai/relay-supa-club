import { useState, useCallback, useEffect, type SetStateAction, type Dispatch, type FC } from 'react';
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
    Cross,
} from 'src/components/icons';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import ProgressHeader from 'src/components/ProgressHeader';
import { SearchBar } from 'src/components/SearchBar';
import { DialogClose } from 'shadcn/components/ui/dialog';
import { Tiptap } from 'src/components/tiptap';
import useSWR from 'swr';
import { apiFetch } from 'src/utils/api/api-fetch';
import type {
    GetAllTemplateResponse,
    GetTemplateResponse,
    GetTemplateVariableResponse,
} from 'pages/api/outreach/email-templates/response';
import { truncatedText } from 'src/utils/outreach/helpers';
import { type Editor } from '@tiptap/react';
import { useAtomValue } from 'jotai';
import { currentEditorAtom } from 'src/atoms/current-editor';
import { TiptapInput } from 'src/components/tiptap/input';
import { Modal } from '../modal';
import { EmailTemplateWizardModal } from './email-template-wizard-modal';

const VARIABLE_GROUPS = ['brand', 'product', 'collab', 'influencer', 'wildcards'];

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];
type VariableGroup = (typeof VARIABLE_GROUPS)[number];

type EmailTemplateModalProps = {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
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
    const { data: template, mutate: refreshTemplate } = useSWR([templateId], async () => {
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
                        {template && (
                            <CustomTemplateDetails status={status} template={template} setTemplate={refreshTemplate} />
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const CustomTemplateDetails = ({
    status,
    template,
    setTemplate,
}: {
    status: OutreachStatus;
    template: GetTemplateResponse;
    setTemplate: (template: GetTemplateResponse) => void;
}) => {
    const { t } = useTranslation();
    const [templateDetails, setTemplateDetails] = useState<GetTemplateResponse>(template);
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
                            {template?.subject}
                        </label>
                    </section>
                </section>
                <section className="h-[200px] min-w-[400px] cursor-default overflow-y-auto rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
                    {template?.template}
                </section>
            </CardDescription>
            <CardFooter className="mt-4 w-full justify-between px-0 pb-0">
                <Button variant="outline">
                    <DeleteOutline className="h-4 w-4 stroke-red-500" />
                </Button>
                <Dialog
                    onOpenChange={(open) => {
                        open ? setStep(1) : setStep(0);
                    }}
                >
                    <DialogTrigger>
                        <Button type="button" className="flex gap-4">
                            <Edit className="h-4 w-4 stroke-white" />
                            Modify Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="min-h-[90vh] min-w-[500px] p-0 md:min-w-[800px] xl:min-w-[1240px]"
                        onPointerDownOutside={(e) => e.preventDefault()}
                    >
                        <DialogHeader>
                            <DialogTitle className="flex w-full flex-col gap-1 py-2">
                                <ProgressHeader labels={progressStep} selectedIndex={step} />
                            </DialogTitle>
                            <DialogDescription className="h-full w-full bg-primary-50 p-6">
                                {step <= 1 ? (
                                    <EditEmailTemplateModalBody
                                        onNextClick={handleNextClick}
                                        templateDetails={templateDetails}
                                        setTemplateDetails={setTemplateDetails}
                                    />
                                ) : (
                                    <NameTemplateBody
                                        templateDetails={templateDetails}
                                        setTemplateDetails={setTemplateDetails}
                                        onSubmit={async () => {
                                            setTemplate(templateDetails);
                                            await apiFetch(
                                                `/api/outreach/email-templates/{id}`,
                                                {
                                                    path: { id: templateDetails.id },
                                                    body: {
                                                        name: templateDetails.name,
                                                        description: templateDetails.description,
                                                        subject: templateDetails.subject,
                                                        template: templateDetails.template,
                                                        step: status,
                                                        variableIds: templateDetails.variables.map(
                                                            (variable) => variable.id,
                                                        ),
                                                    },
                                                },
                                                {
                                                    method: 'PUT',
                                                },
                                            );
                                        }}
                                    />
                                )}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
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
    setTemplateDetails,
}: {
    subject: string;
    status: OutreachStatus;
    content: string;
    onNextClick: () => void;
    onStatusChange: (status: OutreachStatus) => void;
    setTemplateDetails: Dispatch<SetStateAction<GetTemplateResponse>>;
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
                    <section className="flex grow-0 flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                        <TiptapInput
                            onChange={(subject: string) => {
                                setSubjectInput(`${status !== 'OUTREACH' ? 'Re: ' : ''}${subject}`);
                                setTemplateDetails((prev) => {
                                    return { ...prev, subject: `${status !== 'OUTREACH' ? 'Re: ' : ''}${subject}` };
                                });
                            }}
                            placeholder={`${status !== 'OUTREACH' ? 'Re: ' : ''}${subject}`}
                            description={`${status !== 'OUTREACH' ? 'Re: ' : ''}${subjectInput}`}
                            onSubmit={() => {
                                //
                            }}
                        />
                    </section>
                </section>
                <section className="h-full min-h-[200px] min-w-[400px] cursor-default rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
                    <Tiptap
                        description={content}
                        placeholder="email body"
                        onChange={(description) => {
                            setTemplateDetails((prev) => {
                                return { ...prev, template: description };
                            });
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
                    type="button"
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

const EditableTemplateCard = ({
    templateDetails,
    setTemplateDetails,
}: {
    templateDetails: GetTemplateResponse;
    setTemplateDetails: Dispatch<SetStateAction<GetTemplateResponse>>;
}) => {
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
                        <input
                            value={templateDetails.name}
                            onChange={(e) => {
                                setTemplateDetails((prev) => {
                                    return { ...prev, name: e.target.value };
                                });
                            }}
                            className="border-none focus:outline-none"
                            placeholder="Create a totally new template"
                        />
                    </CardTitle>
                    <CardDescription className="font-normal text-gray-400">
                        <input
                            value={templateDetails.description}
                            onChange={(e) => {
                                setTemplateDetails((prev) => {
                                    return { ...prev, description: e.target.value };
                                });
                            }}
                            className="border-none focus:outline-none"
                            placeholder="A blank canvas to call your own!"
                        />
                    </CardDescription>
                </section>
            </CardHeader>
        </Card>
    );
};

const NameTemplateBody = ({
    templateDetails,
    setTemplateDetails,
    onSubmit,
}: {
    templateDetails: GetTemplateResponse;
    setTemplateDetails: Dispatch<SetStateAction<GetTemplateResponse>>;
    onSubmit: () => void;
}) => {
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
                <EditableTemplateCard templateDetails={templateDetails} setTemplateDetails={setTemplateDetails} />
            </section>
            <section className="flex justify-end gap-2">
                <DialogClose>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={onSubmit}>Save template</Button>
            </section>
        </div>
    );
};

const TemplateTabContent = ({ status, templates }: { status: OutreachStatus; templates: GetAllTemplateResponse[] }) => {
    const [showTemplateWizard, setShowTemplateWizard] = useState<boolean>(false);
    return (
        <>
            <EmailTemplateWizardModal
                modalOpen={showTemplateWizard}
                setModalOpen={(open) => setShowTemplateWizard(open)}
            />
            <section className="divide-y-2 p-8">
                {templates.length > 0 && (
                    <div className="my-6 grid max-h-[350px] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
                        {templates.map((template) => (
                            <CustomTemplateCard key={template.id} templateId={template.id} status={status} />
                        ))}
                    </div>
                )}
                <div>
                    <section className="pb-3">
                        <p className="text-xl font-semibold text-gray-600 placeholder-gray-600">Start fresh</p>
                        <p className="font-normal text-gray-500 placeholder-gray-500">
                            If you already have a template in mind
                        </p>
                    </section>
                    <div className="hover:cursor-pointer" onClick={() => setShowTemplateWizard(true)}>
                        <NewTemplateCard />
                    </div>
                </div>
            </section>
        </>
    );
};

const EmailTemplateModalBody = () => {
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

const VariableGroup = ({
    variableGroup,
    onClick,
}: {
    variableGroup: { title: VariableGroup; variables: GetTemplateVariableResponse[] };
    onClick: (variable: GetTemplateVariableResponse) => void;
}) => {
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
                {variables?.map((variable, index) => (
                    <p
                        onClick={() => onClick(variable)}
                        className={`flex cursor-pointer items-center gap-1 p-3 font-semibold ${
                            index % 2 !== 0 && 'bg-gray-50'
                        }`}
                        key={`variable-${title}-${variable.id}`}
                    >
                        {'{'}
                        <span className="font-semibold text-primary-600">{variable.name}</span>
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

export const addVariable = (editor: Editor | null, text: string) => {
    editor?.commands.insertContent(`<variable-component text="${text}" />`);
};

const EditEmailTemplateModalBody = ({
    onNextClick,
    templateDetails,
    setTemplateDetails,
}: {
    onNextClick: () => void;
    templateDetails: GetTemplateResponse;
    setTemplateDetails: Dispatch<SetStateAction<GetTemplateResponse>>;
}) => {
    const [status, setStatus] = useState('OUTREACH' as OutreachStatus);
    const { data: variables } = useSWR('/api/outreach/variables', async () => {
        const res = await apiFetch<GetTemplateVariableResponse[]>('/api/outreach/variables');
        const groupedVariables = res.content.reduce(
            (
                acc: { title: string; variables: GetTemplateVariableResponse[] }[],
                variable: GetTemplateVariableResponse,
            ) => {
                const key = variable.category;
                const index = acc.findIndex((item) => item.title === key);
                if (index === -1) {
                    acc.push({ title: key, variables: [variable] });
                } else {
                    acc[index].variables.push(variable);
                }
                return acc;
            },
            [],
        );
        return groupedVariables;
    });
    const [filteredVariables, setFilteredVariables] = useState(variables);
    const [searchTerm, setSearchTerm] = useState('');
    const editor = useAtomValue(currentEditorAtom);

    useEffect(() => {
        if (!variables) return;
        if (searchTerm === '') {
            setFilteredVariables(variables);
            return;
        }
        const fuse = new Fuse(variables, {
            keys: ['title', 'variables'],
        });
        const results = fuse.search(searchTerm);
        setFilteredVariables(results.map((result) => result.item));
    }, [searchTerm, variables]);
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
                        <Accordion id={filteredVariables?.[0].title} type="multiple">
                            {filteredVariables?.map((group) => (
                                <VariableGroup
                                    onClick={(variable: GetTemplateVariableResponse) => {
                                        addVariable(editor, variable.name);
                                        setTemplateDetails((prev) => {
                                            return { ...prev, variables: [...prev.variables, variable] };
                                        });
                                    }}
                                    key={'group-' + group.title}
                                    variableGroup={group}
                                />
                            ))}
                        </Accordion>
                    </div>
                </section>
            </section>
            <section className="basis-4/5 px-9 py-3">
                <EditCustomTemplateDetails
                    status={status}
                    subject={templateDetails.subject}
                    content={templateDetails.template}
                    setTemplateDetails={setTemplateDetails}
                    onNextClick={onNextClick}
                    onStatusChange={(status) => {
                        setStatus(status);
                    }}
                />
            </section>
        </div>
    );
};

export const EmailTemplateModal: FC<EmailTemplateModalProps> = ({ modalOpen, setModalOpen }) => {
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
                <EmailTemplateModalBody />
                {/* body end */}
            </div>
        </Modal>
    );
};
