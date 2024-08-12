/* eslint-disable react-hooks/exhaustive-deps */
import { type FC } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import { SendOutline } from 'src/components/icons';
import Bell from 'src/components/icons/Bell';
import { useSequence } from 'src/hooks/v2/use-sequences';
import { type VariableWithValue, type TemplateWithVariableValueType } from 'src/store/reducers/sequence';

type SequenceVariableAccordionProps = {
    title: string;
    items: VariableWithValue[];
};

export const SequenceVariableAccordion: FC<SequenceVariableAccordionProps> = ({ title, items }) => {
    const { setSelectedTemplate, selectedTemplate } = useSequence();

    const onVariableChange = (id: string, value: string) => {
        const variables = selectedTemplate?.variables.map((v) => {
            if (v.id === id) {
                return { ...v, value };
            }
            return v;
        });
        setSelectedTemplate({
            ...selectedTemplate,
            variables: variables ?? [],
        } as TemplateWithVariableValueType);
    };

    return (
        <AccordionItem value={title.replace(/[\s-]/g, '').toLowerCase()}>
            <AccordionTrigger className="ml-6 shrink grow basis-0 font-['Poppins'] text-base font-semibold tracking-tight text-violet-600 hover:no-underline">
                <div className="inline-flex space-x-2">
                    {title === 'Outreach' ? (
                        <SendOutline className="h-4 w-4 -rotate-45" strokeWidth={2} />
                    ) : (
                        <Bell className="h-4 w-4 self-center" />
                    )}
                    <span>{title}</span>
                </div>
            </AccordionTrigger>
            {items.map((d) => (
                <AccordionContent
                    key={d.id}
                    className={`relative w-full !pb-2 pl-5 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700`}
                >
                    <div className="inline-flex h-fit w-[280px] flex-col items-start justify-start gap-0">
                        <div className="flex h-16 flex-col items-start justify-start gap-1 self-stretch">
                            <div className="inline-flex items-start justify-start gap-1 self-stretch">
                                <div>
                                    <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700">
                                        {'{'}{' '}
                                    </span>
                                    <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-violet-600">
                                        {d.name}
                                    </span>
                                    <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700">
                                        {' '}
                                        {'}'}
                                    </span>
                                </div>
                                <div className="relative h-3 w-3" />
                            </div>
                            <input
                                type="text"
                                className="flex w-full shrink grow basis-0 items-center justify-start gap-2 rounded-md border border-gray-200 bg-white font-['Poppins'] text-sm font-medium tracking-tight text-gray-400 shadow"
                                placeholder={`Variable value for ${d.name}`}
                                value={d.value}
                                onChange={(e) => onVariableChange(d.id, e.target.value)}
                            />
                        </div>
                    </div>
                </AccordionContent>
            ))}
        </AccordionItem>
    );
};
