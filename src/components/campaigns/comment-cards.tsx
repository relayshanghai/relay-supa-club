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

    const importantMessages = () => {
        const pinnedMessages = campaignCreatorNotes?.filter((note) => note.important === true);
        // console.log(pinnedMessages);
        if (pinnedMessages.length > 0)
            return (
                <div className="fixed z-20 w-full bg-gray-100 p-2 ">
                    <div className=" relative w-fit rounded-lg border border-primary-200 bg-primary-100 py-1 px-4 text-primary-500 hover:cursor-pointer">
                        {t('campaigns.show.importantMessages')}
                        <div className="absolute -top-1 -right-2 z-40 h-4 w-4 rounded-full bg-red-500 text-center text-white">
                            {pinnedMessages.length}
                        </div>
                    </div>
                </div>
            );
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
                    {importantMessages()}
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
