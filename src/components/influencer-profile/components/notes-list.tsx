import type { HTMLAttributes } from 'react';
import { Note } from './note';

type Props = {
    //
} & HTMLAttributes<HTMLDivElement>;

export const NotesList = (props: Props) => {
    const sample = {
        author: {
            id: '1',
            name: 'John',
            avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=PunchSour&size=96',
        },
        content: 'Hello this is a sample content',
        id: '2',
        created_at: '2023-08-14T05:19:22.950Z',
        updated_at: '2023-08-14T05:19:22.950Z',
    };

    return (
        <div className="flex flex-grow flex-col gap-9" {...props}>
            <div className="flex flex-col gap-4">
                <div className="text-base font-semibold leading-normal tracking-tight text-gray-700">TEST</div>
                <div className="flex flex-col gap-4">
                    <Note data={sample} />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="text-base font-semibold leading-normal tracking-tight text-gray-700">TEST</div>
                <div className="flex flex-col gap-4">
                    <Note data={sample} />
                    <Note data={sample} />
                </div>
            </div>
        </div>
    );
};
