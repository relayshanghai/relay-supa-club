import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Underline } from '@tiptap/extension-underline';
import { Toolbar } from './toolbar';
import { Paperclip, Send } from 'src/components/icons';
import AttachmentField from './attachment-field';
import type { AttachmentFile } from 'src/utils/outreach/types';
import AttachmentFileItem from './attachment-file-item';

export const Tiptap = ({
    description,
    onChange,
    onSubmit,
    attachments,
    handleRemoveAttachment,
    handleAttachmentSelect,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
    attachments: AttachmentFile[] | null;
    handleRemoveAttachment: (file: AttachmentFile) => void;
    handleAttachmentSelect: (files: AttachmentFile[] | null, error?: any) => void;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
                validate: (href) => /^https?:\/\//.test(href),
                HTMLAttributes: {
                    class: 'text-primary-500 hover:underline cursor-pointer',
                },
            }),
            Underline.configure({
                HTMLAttributes: {
                    class: 'my-custom-class',
                },
            }),
            BulletList.configure({
                itemTypeName: 'listItem',
                keepAttributes: true,
                keepMarks: true,
                HTMLAttributes: {
                    class: 'list-disc ml-2',
                },
            }),
        ],
        content: description,
        editorProps: {
            attributes: {
                class: 'flex min-h-[150px] w-full rounded-md border border-input bg-transparent p-3 transition-all text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary-400 focus-visible:ring-primary-400 focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
                editor?.commands.clearContent();
            }}
            className="min-h-[250]px flex flex-col justify-stretch gap-2"
        >
            <EditorContent spellCheck="false" editor={editor} />
            <div className="flex gap-2">
                {attachments &&
                    attachments.map((file) => {
                        return <AttachmentFileItem key={file.id} file={file} onRemove={handleRemoveAttachment} />;
                    })}
            </div>
            <section className="flex items-center justify-between rounded border p-1">
                <div className="flex">
                    <Toolbar editor={editor} />

                    <AttachmentField
                        multiple={true}
                        accept="image/*,.pdf,.rar,.zip,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.txt,.csv,video/*"
                        onChange={handleAttachmentSelect}
                        render={({ openField }) => {
                            return (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openField();
                                    }}
                                >
                                    <Paperclip className="h-5 w-5 stroke-gray-300" />
                                </button>
                            );
                        }}
                    />
                </div>

                <button type="submit" className="mx-2 cursor-pointer">
                    <Send className="h-6 w-6 stroke-gray-400" />
                </button>
            </section>
        </form>
    );
};
