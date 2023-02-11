import { toast } from 'react-hot-toast';

export const copyToClipboard = (text: string): void => {
    const isClipboardAPISupported = navigator.clipboard && !!navigator.clipboard.writeText;

    if (!isClipboardAPISupported) {
        return;
    }
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
};
