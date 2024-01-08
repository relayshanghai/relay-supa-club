import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Toolbar } from './toolbar';
import { Send } from 'src/components/icons';
import { HardBreak } from '@tiptap/extension-hard-break';

export const Tiptap = ({
    description,
    onChange,
    onSubmit,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Link.configure(),
            BulletList.configure({
                itemTypeName: 'listItem',
                keepAttributes: true,
                keepMarks: true,
                HTMLAttributes: {
                    class: 'list-disc ml-2',
                },
            }),
            HardBreak.extend({
                addKeyboardShortcuts() {
                    return {
                        Enter: () => {
                            const { state } = this.editor;
                            const { $from } = state.selection;
                            // console.log($from.parent.type.name);
                            if ($from.parent.type.name === 'paragraph') {
                                return this.editor.commands.setHardBreak();
                            }
                            return false;
                        },
                    };
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
            className="min-h-[250]px flex flex-col justify-stretch"
        >
            <EditorContent editor={editor} />
            <section className="flex items-center justify-between border border-t-transparent">
                <Toolbar editor={editor} />
                <button type="submit" className="mx-5 cursor-pointer">
                    <Send className="h-5 w-5 stroke-gray-400" />
                </button>
            </section>
        </form>
    );
};
