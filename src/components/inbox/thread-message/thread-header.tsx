import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ThreadEntity } from "src/backend/database/thread/thread-entity";
import { Collapse, Expand } from 'src/components/icons';
import { useUser } from "src/hooks/use-user";
import { formatDate } from "src/utils/datetime";

export default function ThreadHeader({
    thread,
    subject,
}: {
    thread: ThreadEntity;
    subject?: string;
}) {
    const { t } = useTranslation();
    const { profile } = useUser();

    const [expanded, setExpanded] = useState(false);
    const participants = thread.contacts?.map((participant) => participant.emailContact?.address === profile?.sequence_send_email ? 'Me' : participant.emailContact.name).join(',');
    const ToggleExpanded = expanded ? Collapse : Expand;
    const productName = thread.sequenceInfluencer?.sequence.templateVariables?.find(variable => variable.key === 'productName')?.value;
    return (
        <div
            className={`flex w-full justify-between bg-white px-2 py-3 shadow-lg ${
                expanded && 'flex-col'
            } relative gap-4`}
        >
            <ToggleExpanded
                className="absolute right-2 top-2 h-4 w-4 cursor-pointer stroke-gray-500"
                onClick={() => setExpanded(!expanded)}
            />
            <div className="flex flex-col gap-2">
                <div className="inline-flex h-14 items-center justify-start gap-3">
                    <span className="flex-col justify-between font-['Poppins'] text-lg font-bold tracking-tight text-gray-700">
                        {subject}
                    </span>
                </div>
            </div>
            <div className="flex flex-col justify-between sm:flex-row">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex h-14 items-center justify-start gap-3">
                        <div className="inline-flex flex-col items-start justify-center gap-2">
                            {expanded && (
                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                    {t('inbox.threadHeader.product')}:
                                </div>
                            )}
                            <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                {t('inbox.threadHeader.sequence')}:
                            </div>
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-2">
                            {thread.sequenceInfluencer?.sequence && (
                                <>
                                    {expanded && (
                                        <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                            {productName}
                                        </div>
                                    )}
                                    <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700 underline">
                                        <Link
                                            className="text-primary-500"
                                            href={`/sequences/${thread.sequenceInfluencer.sequence.id}`}
                                        >
                                            {thread.sequenceInfluencer.sequence.name}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {expanded && (
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex h-14 items-end justify-start gap-3">
                            <div className="inline-flex flex-col items-end justify-center gap-2">
                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                    {t('inbox.threadHeader.participants')}:
                                </div>
                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                    {t('inbox.threadHeader.firstReply')}:
                                </div>
                            </div>
                            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-2">
                                <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                    {participants}
                                </div>
                                <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                    {formatDate(thread.createdAt?.toString() ?? '', '[date] [monthShort] [fullYear]')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
