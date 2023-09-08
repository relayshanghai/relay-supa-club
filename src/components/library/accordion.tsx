import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { SplitParagraphs } from 'src/utils/split-paragraphs';

export type AccordionContent = {
    title: string;
    detail: string;
};
export const Accordion = ({ content, isFAQ = true }: { content: AccordionContent[]; isFAQ?: boolean }) => {
    return (
        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {content.map(({ title, detail }) => (
                <Disclosure as="div" key={title} className="pt-6">
                    {({ open }) => (
                        <>
                            <dt>
                                <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-600">
                                    <div className="flex justify-start">
                                        {isFAQ && (
                                            <h3 className="w-[24px] min-w-[24px] text-lg font-medium leading-7">Q: </h3>
                                        )}
                                        <h3 className="text-lg font-medium leading-7">{title}</h3>
                                    </div>
                                    <span className="ml-6 flex h-7 items-center">
                                        {open ? (
                                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                        )}
                                    </span>
                                </Disclosure.Button>
                            </dt>
                            <Disclosure.Panel as="dd" className="mt-2 flex pr-12">
                                {isFAQ && (
                                    <p className="w-[24px] min-w-[24px] self-baseline text-base leading-7 text-gray-500">
                                        A:{' '}
                                    </p>
                                )}
                                <div className="block">
                                    <SplitParagraphs className="mb-2 text-base leading-7 text-gray-500" text={detail} />
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </dl>
    );
};
