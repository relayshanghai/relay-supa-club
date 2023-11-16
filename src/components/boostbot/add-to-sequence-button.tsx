import { Button } from '../button';

export const AddToSequenceButton = ({
    outReachDisabled,
    handleAddToSequenceButton,
    buttonText,
    textClassName,
}: {
    outReachDisabled: boolean;
    handleAddToSequenceButton: () => void;
    buttonText: string;
    textClassName?: string;
}) => {
    return (
        <Button
            data-testid="boostbot-button-outreach"
            onClick={handleAddToSequenceButton}
            disabled={outReachDisabled}
            className={`${!outReachDisabled && 'boostbot-gradient'} border-none text-sm font-semibold transition-all`}
        >
            <p className={textClassName}>{buttonText}</p>
            {/* {t('boostbot.chat.outreachSelected')} */}
        </Button>
    );
};
