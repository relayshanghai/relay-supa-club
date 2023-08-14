import type { HTMLAttributes } from 'react';

export type NoteData = {
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    id: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    data: NoteData;
} & HTMLAttributes<HTMLDivElement>;

export const Note = ({ data, ...props }: Props) => {
    return (
        <div
            className="flex flex-col items-start justify-start gap-3 self-stretch rounded-lg border border-gray-300 px-5 py-4"
            {...props}
        >
            <div className="inline-flex items-start justify-between gap-2.5 self-stretch">
                <div className="flex items-center justify-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-300">&nbsp;</div>
                    <div className="text-base font-normal leading-normal tracking-tight text-gray-500">
                        {data.author.name}
                    </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                    <div className="relative h-4 w-4" />
                </div>
            </div>
            <div className="flex h-[146px] flex-col items-start justify-start gap-2.5 self-stretch">
                <div className="self-stretch text-base font-normal leading-normal tracking-tight text-gray-600">
                    {data.content}
                </div>
                <div className="inline-flex items-center justify-start gap-1">
                    <div className="text-xs font-normal leading-none tracking-tight text-gray-500">updated_at</div>
                </div>
            </div>
        </div>
    );
};
