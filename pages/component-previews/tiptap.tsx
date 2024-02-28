import { Tiptap } from 'src/components/inbox/wip/tiptap';

const PreviewTiptap = () => {
    return (
        <div className="m-6 border-2 border-black p-6">
            <Tiptap
                description={''}
                onChange={(text: string) => {
                    // eslint-disable-next-line no-console
                    console.log(text);
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
        </div>
    );
};

export default PreviewTiptap;
