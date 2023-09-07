import type { AccordionContent } from './accordion';
import { Accordion } from './accordion';

export const Faq = ({ content, title }: { content: AccordionContent[]; title: string }) => {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">{title}</h2>
                    <Accordion content={content} />
                </div>
            </div>
        </div>
    );
};
