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
    <div className="bg-red-50 text-right text-sm rounded-md px-6 py-4 absolute top-0 right-0 z-50">
        <div className="text-red-600 mb-2">{errorMessage}</div>
        {buttonAction && buttonText && <Button onClick={buttonAction}>{buttonText}</Button>}
    </div>
);
