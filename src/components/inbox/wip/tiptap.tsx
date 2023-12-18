import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './toolbar';
import { Send } from 'src/components/icons';

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
        extensions: [StarterKit.configure()],
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
            }}
            className="min-h-[250]px flex flex-col justify-stretch"
        >
            <EditorContent editor={editor} />
            <section className="flex items-center justify-between border border-t-transparent">
                <Toolbar editor={editor} />
                <button type="submit" className="cursor-pointer rounded-full bg-primary-500 p-2">
                    <Send className="h-4 w-4 stroke-white" />
                </button>
            </section>
        </form>
    );
};
