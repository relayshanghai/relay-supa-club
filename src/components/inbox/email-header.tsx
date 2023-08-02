// import type { SequenceInfluencer } from 'src/utils/api/db';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const EmailHeader = ({ messages }: { messages: SearchResponseMessage[] }) => {
    //TODO: pass selected sequence influencer as another pram
    return (
        <div className=" border-b-2 border-tertiary-200 px-3 py-6">
            <div className="flex flex-col">
                <div className="text-2xl font-semibold text-primary-500">
                    @<span className="text-gray-700">influencer_handle</span>
                </div>
                <div className="truncate px-4 text-xl font-semibold text-gray-400">
                    {messages[0]?.subject || 'subject'}
                </div>
            </div>
        </div>
    );
};
