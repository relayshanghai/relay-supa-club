import { useRouter } from 'next/router';
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
    const router = useRouter();
    const buttonColor = router.pathname.includes('boostbot') ? 'boostbot-gradient' : 'bg-primary-600';
    return (
        <Button
            data-testid="boostbot-button-outreach"
            onClick={handleAddToSequenceButton}
            disabled={outReachDisabled}
            className={`${!outReachDisabled && buttonColor} border-none text-sm font-semibold transition-all`}
        >
            <p className={textClassName}>{buttonText}</p>
        </Button>
    );
};
