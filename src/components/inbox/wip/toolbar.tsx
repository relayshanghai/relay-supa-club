import { FontItalicIcon, FontBoldIcon } from '@radix-ui/react-icons';
import type { Editor } from '@tiptap/react';
import { Toggle } from 'shadcn/components/ui/toggle';

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }
    return (
        <div>
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <FontBoldIcon className="h-4 w-4 stroke-gray-400" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FontItalicIcon className="h-4 w-4 stroke-gray-400" />
            </Toggle>
        </div>
    );
};
