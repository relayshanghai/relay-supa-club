import { useTranslation } from 'react-i18next';
import CommentCard from './comment-card';
import { useNotes } from 'src/hooks/use-notes';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import CommentCardsSkeleton from './comment-cards-skeleton';
import { useEffect, useRef } from 'react';

export default function CommentCards({
    currentCreator,
}: {
    currentCreator: CampaignCreatorDB | null;
}) {
    const { t } = useTranslation();
    const { isLoading, campaignCreatorNotes } = useNotes({
        campaignCreatorId: currentCreator?.id,
    });

    const commentsEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [campaignCreatorNotes]);

    return (
        <div className=" flex h-96 w-full flex-col overflow-y-auto text-xs">
            {isLoading ? (
                <CommentCardsSkeleton />
            ) : (
                <>
                    {campaignCreatorNotes?.length > 0 ? (
                        <>
                            <>
                                {campaignCreatorNotes?.map((note) => (
                                    <CommentCard key={note.id} note={note} />
                                ))}
                            </>
                        </>
                    ) : (
                        <div className="mt-4 text-center text-gray-500">
                            {t('campaigns.creatorModal.commentsDescr')}
                        </div>
                    )}
                </>
            )}
            <div ref={commentsEndRef} />
        </div>
    );
}
