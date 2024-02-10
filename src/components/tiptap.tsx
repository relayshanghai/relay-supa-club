import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Underline } from '@tiptap/extension-underline';
import { useEffect } from 'react';
import { Toolbar } from './inbox/wip/toolbar';

export const Tiptap = ({
    description,
    onChange,
    onSubmit,
    placeholder,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
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
                class: 'w-full bg-transparent p-3 h-full transition-all text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary-0 focus-visible:ring-primary-0 focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
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
            className="min-h-[250]px flex h-full flex-col justify-stretch"
        >
            <div className="flex">
                <Toolbar editor={editor} />
            </div>
            <EditorContent className="h-full" spellCheck="false" placeholder={placeholder} editor={editor} />
        </form>
    );
};
