import { useState, type SetStateAction, type Dispatch } from 'react';
import { Card, CardDescription } from 'shadcn/components/ui/card';
import { type OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import { Tiptap } from 'src/components/tiptap';
import type { GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { TiptapInput } from 'src/components/tiptap/input';

type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export const EmailTemplateEditor = ({
    subject,
    status,
    content,
    setTemplateDetails,
}: {
    subject: string;
    status: OutreachStatus;
    content: string;
    setTemplateDetails: Dispatch<SetStateAction<GetTemplateResponse>>;
}) => {
    const [subjectInput, setSubjectInput] = useState('');
    return (
        <Card className="flex h-full w-full flex-col justify-between gap-2 border-none shadow-none">
            <CardDescription className="flex h-full flex-col gap-4">
                <section className="flex w-full justify-between gap-6">
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
                        options={{
                            formClassName: 'h-[350px]',
                        }}
                    />
                </section>
            </CardDescription>
        </Card>
    );
};
