import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Underline } from '@tiptap/extension-underline';
import { Toolbar } from './toolbar';
import { Paperclip, Send } from 'src/components/icons';
import AttachmentField from './attachment-field';
import type { AttachmentFile } from 'src/utils/outreach/types';
import AttachmentFileItem from './attachment-file-item';
import { useEffect } from 'react';

export const Tiptap = ({
    description,
    onChange,
    onSubmit,
    attachments,
    handleRemoveAttachment,
    handleAttachmentSelect,
    placeholder,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
    attachments: AttachmentFile[] | null;
    handleRemoveAttachment: (file: AttachmentFile) => void;
    handleAttachmentSelect: (files: AttachmentFile[] | null, error?: any) => void;
    placeholder?: string;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                hardBreak: false,
            }),
            Placeholder.configure({
                showOnlyWhenEditable: false,
                emptyNodeClass:
                    'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
            }),
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
                class: 'w-full bg-transparent p-3 transition-all text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary-0 focus-visible:ring-primary-0 focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });
    useEffect(() => {
        const placeholderExtension = editor?.extensionManager.extensions.find(
            (extension) => extension.name === 'placeholder',
        );
        if (placeholderExtension) {
            placeholderExtension.options['placeholder'] = placeholder;
        }
        editor?.view.dispatch(editor?.state.tr);
    }, [placeholder, editor]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
                editor?.commands.clearContent();
            }}
            className="min-h-[250]px flex flex-col justify-stretch gap-2"
        >
            <EditorContent spellCheck="false" placeholder={placeholder} editor={editor} />
            <div className="flex gap-2">
                {attachments &&
                    attachments.map((file) => {
                        return <AttachmentFileItem key={file.id} file={file} onRemove={handleRemoveAttachment} />;
                    })}
            </div>
            <section className="flex items-center justify-between rounded border-t-2 border-slate-50 p-1">
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
