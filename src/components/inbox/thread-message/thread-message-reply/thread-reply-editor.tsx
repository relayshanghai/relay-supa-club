import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Underline } from '@tiptap/extension-underline';
import type { AttachmentFile } from 'src/utils/outreach/types';
import { useCallback, useEffect, useState } from 'react';
import useStorage from 'src/hooks/use-storage';
import ThreadReplyAttachmentFileItem from './thread-reply-attachment-file-item';
import { ThreadReplyEditorToolbar } from './thread-reply-editor-toolbar';
import ThreadReplyAttachmentField from './thread-reply-attachment-field';
import { Paperclip, Send, Spinner } from 'src/components/icons';
import { Loading } from 'src/components/icons/Loading';
import { useTranslation } from 'react-i18next';
const regex = /^[\w\d\-_\s\.]+$/g;

export default function ThreadReplyEditor({
    description,
    onChange,
    onSubmit,
    attachments,
    handleRemoveAttachment,
    handleAttachmentSelect,
    placeholder,
    loading,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
    attachments: string[] | null;
    handleRemoveAttachment: (file: string) => void;
    handleAttachmentSelect: (files: string[]) => void;
    placeholder?: string;
    loading?: boolean;
}) {
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
    const [uploadError, setUploadError] = useState<string>();

    const { upload, uploading, remove } = useStorage('attachments');
    const { t } = useTranslation();
    const onUploadStorage = useCallback(
        async (file: AttachmentFile[]) => {
            setUploadError(undefined);
            for (const f of file) {
                if (!regex.test(f.filename)) {
                    setUploadError(t('inbox.filenameValidationMessage') as string);
                    return;
                }
            }
            await upload(file);
            handleAttachmentSelect(file.map((f) => f.filename));
        },
        [upload, handleAttachmentSelect, setUploadError, t],
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
                        return <ThreadReplyAttachmentFileItem key={file} file={file} onRemove={onRemoveStorage} />;
                    })}
            </div>
            <section className="flex items-center justify-between rounded border-t-2 border-slate-50 p-1">
                <div className="flex">
                    <ThreadReplyEditorToolbar editor={editor} />
                    <ThreadReplyAttachmentField
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
                            <Loading />
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                    {uploadError && <div className="text-red-500">{uploadError}</div>}
                </div>
                <button type="submit" className="mx-2 cursor-pointer">
                    {loading ? <Spinner /> : <Send className="h-6 w-6 stroke-gray-400" />}
                </button>
            </section>
        </form>
    );
}
