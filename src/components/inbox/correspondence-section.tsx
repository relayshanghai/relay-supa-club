import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { Email } from './Email';

export const CorrespondenceSection = ({
    selectedMessages,
    loadingSelectedMessages,
}: {
    selectedMessages: SearchResponseMessage[];
    loadingSelectedMessages: boolean;
}) => {
    return (
        <div>
            {loadingSelectedMessages ? (
                <div className="flex w-full items-center justify-center">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
            ) : (
                <>
                    {selectedMessages.map((message) => (
                        <li className="m-2 border border-black p-2" key={message.id}>
                            <Email message={message} />
                        </li>
                    ))}
                </>
            )}
        </div>
    );
};
