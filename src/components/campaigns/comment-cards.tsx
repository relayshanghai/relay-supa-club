import CommentCard from './comment-card';
import { useNotes } from 'src/hooks/use-notes';
import type { CampaignCreatorDB } from 'src/utils/api/db';

export default function CommentCards({
    currentCreator,
}: {
    currentCreator: CampaignCreatorDB | null;
}) {
    const { campaignNotes } = useNotes({ campaignCreatorId: currentCreator?.id });

    return (
        <div className="text-xs w-full h-96 flex flex-col overflow-y-auto">
            {campaignNotes?.map((note) => (
                <CommentCard key={note.id} note={note} />
            ))}
        </div>
    );
}
