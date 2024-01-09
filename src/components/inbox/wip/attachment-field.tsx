import type { InputHTMLAttributes } from 'react';
import { Input } from 'shadcn/components/ui/input';
import type { AttachmentFile } from 'src/utils/outreach/types';

const convertFileToBase64 = (file: File) => {
    return new Promise<AttachmentFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string' || reader.result === null) {
                resolve({ filename: file.name, content: (reader.result ?? '').replace(/^.*,/, '') });
            }
            return reject('Only supports string buffer');
        };
        reader.onerror = (e) => reject(e);
    });
};

export type AttachmentFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange: (file: AttachmentFile[] | null, error?: any) => void;
};

const AttachmentField = ({ onChange, ...props }: AttachmentFieldProps) => {
    const handleFileSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = (event) => {
        if (!event.target.files || event.target.files.length <= 0) return;

        const converts = Array.from(event.target.files).map((file) => convertFileToBase64(file));

        Promise.all(converts)
            .then((files) => {
                onChange(files);
            })
            .catch((error) => {
                onChange(null, error);
            });
    };

    return <Input {...props} type="file" onChange={handleFileSelect} />;
};

export default AttachmentField;
