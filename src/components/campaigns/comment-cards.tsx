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
        <div className=" text-xs w-full h-96 flex flex-col overflow-y-auto">
            {isLoading ? (
                <CommentCardsSkeleton />
            ) : (
                <>
                    {campaignCreatorNotes?.length === 0 ? (
                        <div className="text-center text-gray-500 mt-4">
                            {t('campaigns.creatorModal.commentsDescr')}
                        </div>
                    ) : (
                        <>
                            <div className="bg-gray-100 rounded-md p-3 sticky top-0 z-30 flex items-center">
                                <img
                                    className="h-8 w-8 rounded-full mr-4"
                                    src={`https://image-cache.brainchild-tech.cn/?link=${currentCreator?.avatar_url}`}
                                    alt=""
                                />
                                <div>{currentCreator?.fullname}</div>
                            </div>
                            <>
                                {campaignCreatorNotes?.map((note) => (
                                    <CommentCard key={note.id} note={note} />
                                ))}
                            </>
                        </>
                    )}
                </>
            )}
            <div ref={commentsEndRef} />
        </div>
    );
}
