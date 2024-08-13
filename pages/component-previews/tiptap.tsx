import { useState } from 'react';
import { Tiptap } from 'src/components/inbox/wip/tiptap-email';

const PreviewTiptap = () => {
    const [description, setDescription] = useState('');
    return (
        <div className="m-6 flex flex-col border-2 border-black p-6">
            <Tiptap
                description={''}
                onChange={(text: string) => {
                    setDescription(text);
                }}
                placeholder={''}
                onSubmit={() => {
                    //
                }}
                attachments={[]}
                handleRemoveAttachment={() => {
                    //
                }}
                handleAttachmentSelect={() => {
                    //
                }}
            />
            <div>
                <p>Preview</p>
                <section className="bg-gray-400 p-4" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
        </div>
    );
};

export default PreviewTiptap;
