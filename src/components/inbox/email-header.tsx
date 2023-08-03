import { useEffect, useState } from 'react';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const EmailHeader = ({ messages }: { messages: SearchResponseMessage[] }) => {
    //TODO: pass selected sequence influencer as another pram
    const [ccInfo, setCcInfo] = useState<{ name: string; email: string }[]>([]);
    const [ccInitials, setCcInitials] = useState<string[]>([]);

    const getCCInfo = (messages: SearchResponseMessage[]) => {
        setCcInfo([]);
        const ccInfo: { name: string; email: string }[] = [];
        messages.forEach((message) => {
            if (message.cc) {
                message.cc.forEach((cc) => {
                    ccInfo.push({ name: cc.name, email: cc.address });
                });
            }
        });
        setCcInfo(ccInfo);
    };

    const getCCNameInitials = (messages: SearchResponseMessage[]) => {
        setCcInitials([]);
        const ccNames: string[] = [];
        messages.forEach((message) => {
            if (message.cc) {
                message.cc.forEach((cc) => {
                    const splitName = cc.name.split(' ');
                    const initials = splitName.map((n) => n[0].toUpperCase());
                    ccNames.push(initials.join(''));
                });
            }
        });
        setCcInitials(ccNames);
    };

    useEffect(() => {
        if (!messages) return;
        getCCInfo(messages);
        getCCNameInitials(messages);
    }, [messages]);

    return (
        <div className="flex w-full items-center justify-between border-b-2 border-tertiary-200 px-4 py-6">
            <div className="flex flex-col">
                <div className="text-2xl font-semibold text-primary-500">
                    @<span className="text-gray-700">influencer_handle</span>
                </div>
                <div className="truncate px-4 text-xl font-semibold text-gray-400">
                    {messages[0]?.subject || 'subject'}
                </div>
            </div>
            <div className="flex flex-col items-center text-gray-500">
                <div className="flex -space-x-2">
                    {ccInitials.map((name) => (
                        <>
                            <div className="inline-flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-full bg-gray-100 font-medium leading-none ring-2 ring-white">
                                {name}
                            </div>
                        </>
                    ))}
                </div>
                <div className="mt-2 flex items-center space-x-2 truncate text-xs">
                    <div className="self-start">CC: </div>
                    <div className="flex flex-col">
                        {ccInfo.map((cc) => (
                            <>
                                <div>{cc.name ?? cc.email}</div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
