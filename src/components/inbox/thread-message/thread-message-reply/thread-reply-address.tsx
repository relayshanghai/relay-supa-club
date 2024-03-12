import type { EmailContact } from "src/backend/database/thread/email-entity";
import { Tooltip } from "src/components/library";
import { truncatedText } from "src/utils/outreach/helpers";

export default function ThreadReplyAddress ({
    info,
    onClick,
    defaultAddress,
}: {
    info: EmailContact;
    onClick: (info: EmailContact) => void;
    defaultAddress?: boolean;
}) {
    return (
        <Tooltip delay={500} content={`${info.name}: ${info.address}`}>
            <span className="flex rounded bg-primary-200 px-2 py-1 text-sm font-semibold text-primary-500 hover:bg-primary-100">
                <p className="max-w-8 overflow-hidden whitespace-break-spaces">
                    {truncatedText(info.name ?? info.address, 15)}
                </p>
                {!defaultAddress && (
                    <span className="cursor-pointer pl-2" onClick={() => onClick(info)}>
                        x
                    </span>
                )}
            </span>
        </Tooltip>
    );
};
