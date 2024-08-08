import { Card, CardDescription } from 'shadcn/components/ui/card';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import { Tiptap } from 'src/components/tiptap';
import type { GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { TiptapInput } from 'src/components/tiptap/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { ChevronDown } from 'src/components/icons';
import { useTranslation } from 'react-i18next';

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export const EmailTemplateEditor = ({
    templateDetails,
    setTemplateDetails,
}: {
    templateDetails: GetTemplateResponse;
    setTemplateDetails: (template: GetTemplateResponse) => void;
}) => {
    const { t } = useTranslation();

    const getOutreachStepsTranslationKeys = (s: OutreachStatus) => {
        switch (s) {
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

    return (
        <Card className="flex h-full w-full flex-col justify-between gap-2 border-none shadow-none">
            <CardDescription className="flex h-full flex-col gap-4">
                <section className="flex w-full justify-between gap-6">
                    <section className="flex grow flex-col gap-2">
                        <p className="whitespace-nowrap text-xl font-semibold text-gray-600">Sequence Step</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-600 shadow">
                                    {t(`outreaches.steps.${getOutreachStepsTranslationKeys(templateDetails.step)}`)}
                                    <ChevronDown className="h-4 w-4 stroke-gray-400" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {OUTREACH_STATUSES.map((s, index) => (
                                    <DropdownMenuItem
                                        className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} grow text-gray-700`}
                                        key={'dropdownitem-' + s}
                                        onSelect={() => {
                                            setTemplateDetails({ ...templateDetails, step: s });
                                        }}
                                    >
                                        {t(`outreaches.steps.${getOutreachStepsTranslationKeys(s)}`)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                    <section className="flex grow-0 flex-col gap-2">
                        <p className="text-xl font-semibold text-gray-600">Subject Line</p>
                        <TiptapInput
                            onChange={(s: string) => {
                                setTemplateDetails({ ...templateDetails, subject: s });
                            }}
                            placeholder={`Email Subject`}
                            description={templateDetails.subject}
                            onSubmit={() => {
                                //
                            }}
                            options={{
                                editor: {
                                    className: '!w-[300px]',
                                },
                            }}
                        />
                    </section>
                </section>
                <section className="h-full min-h-[200px] min-w-[400px] cursor-default rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500">
                    <Tiptap
                        description={templateDetails.template}
                        placeholder="Write your email template here"
                        onChange={(description) => {
                            setTemplateDetails({ ...templateDetails, template: description });
                        }}
                        onSubmit={() => {
                            //
                        }}
                        options={{
                            formClassName: 'h-[350px]',
                        }}
                    />
                </section>
            </CardDescription>
        </Card>
    );
};
