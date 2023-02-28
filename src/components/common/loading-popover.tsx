import { Loader } from '../icons';

/** Note: this component has an absolute position of top-0 right-0 */
export const LoadingPopover = ({ text }: { text: string }) => {
    return (
        <div className="absolute top-0 right-0 z-50 flex items-center rounded-md bg-white px-6 py-4 text-sm text-gray-600">
            <Loader className="mr-2 h-4 w-4 fill-current text-primary-500" />
            <div className="animate-pulse">{text}</div>
        </div>
    );
};
