import { Button } from '../button';

export const AddToSequenceButton = ({
    outReachDisabled,
    handleAddToSequenceButton,
    buttonText,
}: {
    outReachDisabled: boolean;
    handleAddToSequenceButton: () => void;
    buttonText: string;
}) => {
    return (
        <Button
            data-testid="boostbot-button-outreach"
            onClick={handleAddToSequenceButton}
            disabled={outReachDisabled}
            className={`${!outReachDisabled && 'boostbot-gradient'} border-none text-sm font-semibold transition-all`}
        >
            {buttonText}
            {/* {t('boostbot.chat.outreachSelected')} */}
        </Button>
    );
};
