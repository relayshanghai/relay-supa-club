import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import { Paragraph } from '@tiptap/extension-paragraph';
import { useSetAtom } from 'jotai';
import { currentEditorAtom } from 'src/atoms/current-editor';
import StarterKit from '@tiptap/starter-kit';
import VariableNode from './variable-node';

export const TiptapInput = ({
    description,
    onChange,
    placeholder,
}: {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
    placeholder?: string;
}) => {
    const setCurrentEditor = useSetAtom(currentEditorAtom);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                hardBreak: false,
            }),

            Paragraph.configure({
                HTMLAttributes: {
                    class: 'whitespace-nowrap grow-0 overflow-x-auto no-scrollbar max-w-[400px] text-clip',
                },
            }),
            VariableNode,
        ],
        content: description,
        editorProps: {
            attributes: {
                class: 'px-2 grow-0 overflow-x-auto text-clip whitespace-nowrap py-1.5 rounded-md border-none focus-visible:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onFocus: ({ editor }) => {
            setCurrentEditor(editor as Editor);
        },
    });

    useEffect(() => {
        setCurrentEditor(editor);
    }, [editor, setCurrentEditor]);

    return (
        <EditorContent
            editor={editor}
            placeholder={placeholder}
            className="w-[400px] grow-0 overflow-x-auto text-clip whitespace-nowrap rounded-md border-2 shadow"
        />
    );
};
