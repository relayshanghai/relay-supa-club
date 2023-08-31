import { useTranslation } from 'react-i18next';
import { Spinner, CheckIcon } from 'src/components/icons';
import type { ProgressType } from 'src/components/boostbot/chat';

type ChatProgressProps = {
    progress: ProgressType;
};

const ChatProgress = ({ progress }: ChatProgressProps) => {
    const { t } = useTranslation();
    const { topics, isMidway, totalFound } = progress;
    const isFirstDone = topics.length > 0;
    const isSecondDone = isMidway;
    const isThirdDone = totalFound !== null;

    const renderIcon = (isDone: boolean) => {
        const iconClasses = 'absolute h-5 w-5 transition-all duration-500 text-primary-600';
        return (
            <div className="relative h-5 w-5 flex-shrink-0">
                <span className={`${iconClasses} ${isDone ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <Spinner className="h-5 w-5 fill-primary-600 text-primary-200" />
                </span>
                <CheckIcon
                    className={`${iconClasses} ${isDone ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                />
            </div>
        );
    };

    const renderStep = (isDone: boolean, heading: string, content: string) => (
        <div className="flex animate-fade-in-from-left flex-row gap-2">
            {renderIcon(isDone)}
            <div className="flex flex-col gap-1">
                <div className="font-medium">{heading}</div>
                {isDone && (
                    <div className="ml-2 animate-fade-in-from-top rounded-md border border-primary-500 p-2 text-xs">
                        {content}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="mb-4 flex flex-col gap-2 text-sm">
            {/* \u00A0 is a non-breaking space, same as &nbsp; but usable in a string literal */}
            {renderStep(isFirstDone, t('boostbot.chat.progress.step1'), `${topics.slice(0, 5).join(', ')},\u00A0...`)}

            {isFirstDone &&
                renderStep(isSecondDone, t('boostbot.chat.progress.step2'), t('boostbot.chat.progress.step2B'))}

            {isSecondDone &&
                renderStep(
                    isThirdDone,
                    t('boostbot.chat.progress.step3'),
                    t('boostbot.chat.progress.step3B', { count: totalFound || 0 }),
                )}
        </div>
    );
};

export default ChatProgress;
