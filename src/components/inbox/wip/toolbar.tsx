import {
    FontItalicIcon,
    FontBoldIcon,
    UnderlineIcon,
    StrikethroughIcon,
    Link2Icon,
    ListBulletIcon,
} from '@radix-ui/react-icons';
import type { Editor } from '@tiptap/react';
import { Toggle } from 'shadcn/components/ui/toggle';

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const addOrEditLink = () => {
        const url = window.prompt('Enter the URL');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    return (
        <div>
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <FontBoldIcon className="h-5 w-5 stroke-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FontItalicIcon className="h-5 w-5 stroke-gray-400" />
            </Toggle>

            <Toggle size="sm" pressed={editor.isActive('link')} onClick={addOrEditLink}>
                <Link2Icon className="h-5 w-5 stroke-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <StrikethroughIcon className="h-5 w-5 stroke-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-5 w-5 stroke-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <ListBulletIcon className="h-5 w-5 stroke-gray-400" />
            </Toggle>
        </div>
    );
};
