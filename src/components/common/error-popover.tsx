import { Button } from '../button';

export const ErrorPopover = ({
    errorMessage,
    buttonText,
    buttonAction,
}: {
    errorMessage: string;
    buttonText?: string;
    buttonAction?: () => void;
}) => (
    <div className="absolute top-0 right-0 z-50 rounded-md bg-red-50 px-6 py-4 text-right text-sm">
        <div className="mb-2 text-red-600">{errorMessage}</div>
        {buttonAction && buttonText && <Button onClick={buttonAction}>{buttonText}</Button>}
    </div>
);
