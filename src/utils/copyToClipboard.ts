import { toast } from 'react-hot-toast';

// COPY TO CLIPBOARD FUNCTION
export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
};
