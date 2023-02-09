import { useTranslation } from 'react-i18next';
import CommentCard from './comment-card';
import { useNotes } from 'src/hooks/use-notes';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import CommentCardsSkeleton from './comment-cards-skeleton';

export default function CommentCards({
    currentCreator,
}: {
    currentCreator: CampaignCreatorDB | null;
}) {
    const { t } = useTranslation();
    const { isLoading, campaignCreatorNotes } = useNotes({
        campaignCreatorId: currentCreator?.id,
    });

    return (
        <div className="text-xs w-full h-96 flex flex-col overflow-y-auto">
            {isLoading ? (
                <CommentCardsSkeleton />
            ) : (
                <>
                    {campaignCreatorNotes?.length === 0 ? (
                        <div className="text-center text-gray-500 mt-4">
                            {t('campaigns.creatorModal.commentsDescr')}
                        </div>
                    ) : (
                        campaignCreatorNotes?.map((note) => (
                            <CommentCard key={note.id} note={note} />
                        ))
                    )}
                </>
            )}
        </div>
    );
}
