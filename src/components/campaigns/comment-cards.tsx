import CommentCard from './comment-card';
import { useNotes } from 'src/hooks/use-notes';
import type { CampaignCreatorDB } from 'src/utils/api/db';
// import { useUser } from 'src/hooks/use-user';

export default function CommentCards({
    currentCreator,
}: {
    currentCreator: CampaignCreatorDB | null;
}) {
    //add conditional styling for the user's own comment, flex-end
    // const { profile } = useUser();
    // const isYour = profile.id === note.user_id;
    const { campaignNotes } = useNotes({ campaignCreatorId: currentCreator?.id });

    // console.log({ campaignNotes });
    return (
        <div className="text-xs px-3 py-3 w-full flex flex-col">
            {campaignNotes &&
                campaignNotes?.map((note) => <CommentCard key={note.id} note={note} />)}
        </div>
    );
}
