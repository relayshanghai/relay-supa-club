import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Underline } from '@tiptap/extension-underline';
import { Toolbar } from './toolbar';
import { Paperclip, Send } from 'src/components/icons';
import AttachmentField from './attachment-field';
import type { AttachmentFile } from 'src/utils/outreach/types';
import AttachmentFileItem from './attachment-file-item';
import { useCallback, useEffect } from 'react';
import useStorage from 'src/hooks/use-storage';

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
    attachments: string[] | null;
    handleRemoveAttachment: (file: string) => void;
    handleAttachmentSelect: (files: string[]) => void;
    placeholder?: string;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                showOnlyWhenEditable: false,
                emptyNodeClass:
                    'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
            }),

            Link.extend({
                inclusive: false,
            }).configure({
                openOnClick: false,
                autolink: true,
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
                    class: 'list-disc ml-8',
                },
            }),
            OrderedList.configure({
                itemTypeName: 'listItem',
                keepAttributes: true,
                keepMarks: true,
                HTMLAttributes: {
                    class: 'list-decimal ml-8',
                },
            }),
            HorizontalRule.configure({
                HTMLAttributes: {
                    class: 'border-1 border-gray-600 my-2',
                },
            }),
            HardBreak.configure({
                keepMarks: false,
            }),
        ],
        content: description,
        editorProps: {
            attributes: {
                class: 'w-full bg-transparent p-3 transition-all text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary-0 focus-visible:ring-primary-0 focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML().replaceAll('<p></p>', '<br>'));
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

    const { upload, uploading, remove } = useStorage('attachments');
    const onUploadStorage = useCallback(
        async (file: AttachmentFile[]) => {
            await upload(file);
            handleAttachmentSelect(file.map((f) => f.filename));
        },
        [upload, handleAttachmentSelect],
    );
    const onRemoveStorage = useCallback(
        async (file: string) => {
            remove(file);
            handleRemoveAttachment(file);
        },
        [remove, handleRemoveAttachment],
    );
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
                        return <AttachmentFileItem key={file} file={file} onRemove={onRemoveStorage} />;
                    })}
            </div>
            <section className="flex items-center justify-between rounded border-t-2 border-slate-50 p-1">
                <div className="flex">
                    <Toolbar editor={editor} />
                    <AttachmentField
                        multiple={true}
                        accept="image/*,.pdf,.rar,.zip,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.txt,.csv,video/*"
                        onChange={onUploadStorage}
                        render={({ openField }) => {
                            return (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openField();
                                    }}
                                >
                                    <Paperclip className="h-5 w-5 fill-gray-400" />
                                </button>
                            );
                        }}
                    />
                    {uploading && (
                        <div role="status" className="p-1">
                            <svg
                                aria-hidden="true"
                                className="inline h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </div>
                <button type="submit" className="mx-2 cursor-pointer">
                    <Send className="h-6 w-6 stroke-gray-400" />
                </button>
            </section>
        </form>
    );
};
