import { toast } from 'react-hot-toast';

const isClipboardAPISupported = navigator.clipboard && !!navigator.clipboard.writeText;

export const copyToClipboard = (text: string): void => {
    if (isClipboardAPISupported) {
        return;
    }
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
};
