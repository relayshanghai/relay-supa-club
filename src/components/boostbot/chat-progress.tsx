import { Spinner, CheckIcon } from 'src/components/icons';
import type { ProgressType } from 'src/components/boostbot/chat';

type ChatProgressProps = {
    progress: ProgressType;
};

const ChatProgress = ({ progress }: ChatProgressProps) => {
    const { topics, isMidway, totalFound } = progress;
    const isFirstDone = topics.length > 0;
    const isSecondDone = isMidway;
    const isThirdDone = totalFound !== null;

    const renderIcon = (isDone: boolean) =>
        isDone ? (
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-primary-600" />
        ) : (
            <Spinner className="h-5 w-5 flex-shrink-0 fill-primary-600 text-primary-200" />
        );

    return (
        <div className="flex flex-col gap-2 text-sm">
            <div className="flex flex-row gap-2">
                {renderIcon(isFirstDone)}
                Generating topics and niches
            </div>

            {isFirstDone && (
                <div className="flex flex-row gap-2">
                    {renderIcon(isSecondDone)}
                    Browsing through millions of influencers in our database
                </div>
            )}

            {isSecondDone && (
                <div className="flex flex-row gap-2">
                    {renderIcon(isThirdDone)}
                    Handpicking the best KOLs based on followers, engagements, location, etc.
                </div>
            )}
        </div>
    );
};

export default ChatProgress;
