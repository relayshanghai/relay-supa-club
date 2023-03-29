import { toast } from 'react-hot-toast';
import { clientLogger } from './logger-client';

export const copyToClipboard = (text: string): void => {
    const isClipboardAPISupported = navigator.clipboard && !!navigator.clipboard.writeText;

    if (!isClipboardAPISupported) {
        clientLogger('clipboard API not supported');
        return;
    }
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
};
