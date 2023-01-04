import { Loader } from '../icons';

/** Note: this component has an absolute position of top-0 right-0 */
export const LoadingPopover = ({ text }: { text: string }) => {
    return (
        <div className="bg-white flex items-center text-gray-600 text-sm rounded-md px-6 py-4 absolute top-0 right-0 z-50">
            <Loader className="h-4 w-4 mr-2 fill-current text-primary-500" />
            <div className="animate-pulse">{text}</div>
        </div>
    );
};
