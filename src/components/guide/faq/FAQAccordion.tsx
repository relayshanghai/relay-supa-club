import type { FC, PropsWithChildren } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';

export type FAQAccordionType = PropsWithChildren<{
    id: string;
    title: string;
}>;

export const FAQAccordion: FC<FAQAccordionType> = ({ id, title, children }) => {
    return (
        <AccordionItem value={id}>
            <AccordionTrigger className="text-sm font-bold">{title}</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
    );
};
