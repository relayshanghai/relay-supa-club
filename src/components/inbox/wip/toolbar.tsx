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

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from 'shadcn/components/ui/dialog';
import { Input } from 'shadcn/components/ui/input';
import { useCallback, useState } from 'react';
import { Button } from 'shadcn/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { NumberedList } from 'src/components/icons';

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
    const addOrEditLink = useCallback(
        (url: string) => {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        },
        [editor],
    );

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
                <FontBoldIcon className="h-5 w-5 text-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FontItalicIcon className="h-5 w-5 text-gray-400" />
            </Toggle>

            <UrlInputDialog
                editor={editor}
                onSave={(url: string) => {
                    addOrEditLink(url);
                }}
                onRemove={() => {
                    editor.chain().focus().unsetLink().run();
                }}
            />

            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <StrikethroughIcon className="h-5 w-5 text-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-5 w-5 text-gray-400" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <ListBulletIcon className="h-5 w-5 text-gray-400" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <NumberedList className="h-4 w-4 text-gray-400" />
            </Toggle>
        </div>
    );
};

interface UrlInputDialogProps {
    onSave: (url: string) => void;
    onRemove: () => void;
    editor: Editor;
}

const UrlInputDialog: React.FC<UrlInputDialogProps> = ({ editor, onSave, onRemove }) => {
    const [urlInput, setUrlInput] = useState('');
    const linkUrl = editor.getAttributes('link').href;
    const { t } = useTranslation();
    return (
        <Dialog
            onOpenChange={(open: boolean) => {
                if (!open) {
                    setUrlInput('');
                }
            }}
        >
            <DialogTrigger>
                <Toggle size="sm" pressed={editor.isActive('link')}>
                    <Link2Icon className="h-5 w-5 text-gray-400" />
                </Toggle>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader />
                <Input
                    value={urlInput || linkUrl}
                    onChange={(e) => {
                        setUrlInput(e.target.value);
                    }}
                    placeholder="Enter the URL"
                />
                <div className="flex justify-end gap-2">
                    <DialogClose>
                        <Button
                            onClick={() => {
                                onSave('https://' + urlInput);
                            }}
                        >
                            {linkUrl ? t('inbox.edit') : t('inbox.save')}
                        </Button>
                    </DialogClose>
                    {linkUrl && (
                        <DialogClose>
                            <Button onClick={onRemove}>{t('inbox.remove')}</Button>
                        </DialogClose>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
