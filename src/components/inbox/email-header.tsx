// import type { SequenceInfluencer } from 'src/utils/api/db';
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
        <div className="flex w-full items-center justify-between border-b-2 border-tertiary-200 px-3 py-6">
            <div className="flex flex-col">
                <div className="text-2xl font-semibold text-primary-500">
                    @<span className="text-gray-700">influencer_handle</span>
                </div>
                <div className="truncate px-4 text-xl font-semibold text-gray-400">
                    {messages[0]?.subject || 'subject'}
                </div>
            </div>
            <div className='text-gray-600" flex flex-col items-center'>
                {ccInitials.map((name) => (
                    <>
                        <div className=" inline-flex h-11 w-11 items-center justify-center rounded-full border-2 bg-gray-100">
                            {name}
                        </div>
                    </>
                ))}
                {ccInfo.map((cc) => (
                    <>
                        <div className="truncate text-xs">{cc.name}</div>
                    </>
                ))}
            </div>
        </div>
    );
};
