import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import { type FC, useEffect } from 'react';
import { Paragraph } from '@tiptap/extension-paragraph';
import { useSetAtom } from 'jotai';
import { currentEditorAtom } from 'src/atoms/current-editor';
import StarterKit from '@tiptap/starter-kit';
import VariableNode from './variable-node';
import { cn } from 'src/utils/classnames';
import Placeholder from '@tiptap/extension-placeholder';

type EditorOptions = {
    className?: string;
};

type TiptapInputProps = {
    description: string;
    onChange: (description: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    placeholder?: string;
    options?: {
        editor?: EditorOptions;
    };
};

export const TiptapInput: FC<TiptapInputProps> = ({ description, onChange, placeholder, options, disabled }) => {
    const setCurrentEditor = useSetAtom(currentEditorAtom);
    const editor = useEditor({
        editable: !disabled,
        extensions: [
            StarterKit.configure({
                hardBreak: false,
            }),
            Placeholder.configure({
                showOnlyWhenEditable: false,
                emptyNodeClass:
                    'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
                emptyEditorClass: '',
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
        <EditorContent
            editor={editor}
            placeholder={placeholder}
            className={cn(
                'w-[400px] grow-0 overflow-x-auto text-clip whitespace-nowrap rounded-md border-2 shadow',
                options?.editor?.className,
            )}
        />
    );
};
