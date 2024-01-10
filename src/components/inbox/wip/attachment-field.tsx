import type { InputHTMLAttributes } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { Input } from 'shadcn/components/ui/input';
import type { AttachmentFile } from 'src/utils/outreach/types';

const convertFileToBase64 = (file: File) => {
    return new Promise<AttachmentFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string' || reader.result === null) {
                resolve({
                    id: String(Math.random()),
                    filename: file.name,
                    content: (reader.result ?? '').replace(/^.*,/, ''),
                });
            }
            return reject('Only supports string buffer');
        };
        reader.onerror = (e) => reject(e);
    });
};

export type AttachmentFieldRenderParams = {
    /**
     * Opens a field.
     *
     * @return {()=>void} openField callback function to open the attachment field
     */
    openField: () => void;
};

export type AttachmentFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange: (file: AttachmentFile[] | null, error?: any) => void;
    render?: (params: AttachmentFieldRenderParams) => JSX.Element;
};

const AttachmentField = ({ onChange, render, ...props }: AttachmentFieldProps) => {
    const fieldRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = useCallback<Required<InputHTMLAttributes<HTMLInputElement>>['onChange']>(
        (event) => {
            if (!event.target.files || event.target.files.length <= 0) return;

            const converts = Array.from(event.target.files).map((file) => convertFileToBase64(file));

            Promise.all(converts)
                .then((files) => {
                    onChange(files);
                })
                .catch((error) => {
                    onChange(null, error);
                })
                .finally(() => {
                    event.target.value = '';
                });
        },
        [onChange],
    );

    const openField = () => fieldRef.current && fieldRef.current.click();

    return (
        <>
            <Input
                {...props}
                ref={fieldRef}
                type="file"
                onChange={handleFileSelect}
                style={{ display: render ? 'none' : 'inline' }}
            />
            {render && render({ openField })}
        </>
    );
};

export default AttachmentField;
