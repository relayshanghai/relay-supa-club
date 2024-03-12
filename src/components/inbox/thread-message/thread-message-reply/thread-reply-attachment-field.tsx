import type { InputHTMLAttributes } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { Input } from 'shadcn/components/ui/input';
import type { AttachmentFile } from 'src/utils/outreach/types';

export type AttachmentFieldRenderParams = {
    /**
     * Opens a field.
     *
     * @return {()=>void} openField callback function to open the attachment field
     */
    openField: () => void;
};

export type AttachmentFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange: (file: AttachmentFile[]) => void;
    render?: (params: AttachmentFieldRenderParams) => JSX.Element;
};

export default function ThreadReplyAttachmentField({ onChange, render, ...props }: AttachmentFieldProps) {
    const fieldRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = useCallback<Required<InputHTMLAttributes<HTMLInputElement>>['onChange']>(
        (event) => {
            if (!event.target.files || event.target.files.length <= 0) return;
            const files = Array.from(event.target.files).map((file): AttachmentFile => {
                // prevent conflict error add timestamp to filename before extension
                const filename = file.name.split('.');
                const extension = filename[filename.length - 1];
                const name = filename.slice(0, filename.length - 1).join('.');
                const generatedFilename = `${name}-${new Date().getTime()}.${extension}`;
                return {
                    content: file,
                    id: file.name,
                    filename: generatedFilename,
                };
            });

            onChange(files);
            event.target.value = '';
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
}
