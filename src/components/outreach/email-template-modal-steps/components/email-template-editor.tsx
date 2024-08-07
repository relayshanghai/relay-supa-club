import { useState, type SetStateAction, type Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shadcn/components/ui/button';
import { Card, CardDescription, CardFooter } from 'shadcn/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { ChevronDown } from 'src/components/icons';
import { type OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import { DialogClose } from 'shadcn/components/ui/dialog';
import { Tiptap } from 'src/components/tiptap';
import type { GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { TiptapInput } from 'src/components/tiptap/input';

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export const EmailTemplateEditor = ({
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
                    {/* <section className="flex grow flex-col gap-2">
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
                    </section> */}
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
                <Button className=" text-gray-400" variant="ghost">
                    Back
                </Button>
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
