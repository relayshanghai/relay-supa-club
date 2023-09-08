import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

export type AccordionContent = {
    title: string;
    detail: string;
};
export const Accordion = ({ content }: { content: AccordionContent[] }) => {
    return (
        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {content.map(({ title, detail }) => (
                <Disclosure as="div" key={title} className="pt-6">
                    {({ open }) => (
                        <>
                            <dt>
                                <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-600">
                                    <span className="text-lg font-medium leading-7">{title}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                        {open ? (
                                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                        )}
                                    </span>
                                </Disclosure.Button>
                            </dt>
                            <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                <p className="whitespace-pre-wrap text-base leading-7 text-gray-500">{detail}</p>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </dl>
    );
};
