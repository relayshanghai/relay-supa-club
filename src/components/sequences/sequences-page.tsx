/* eslint-disable complexity */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequences } from 'src/hooks/use-sequences';
import { useSession } from 'src/hooks/use-session';
import { rudderInitialized } from 'src/utils/rudder-initialize';
import { Button } from '../button';
import { Plus } from '../icons';
import { Layout } from '../layout';
import { CreateSequenceModal } from './create-sequence-modal';
import { SequenceStats } from './sequence-stats';
import SequencesTable from './sequences-table';

const useRudderstackTrack = () => {
    const isTracking = useRef(false);
    // const [rudder, setRudder] = useState(() => rudderInitialized())
    // const { session, profile } = useSession();

    useEffect(() => {
        // console.log("reload rudder", window.rudder)
        if (window.rudder) return;

        rudderInitialized().then(() => {
            // console.log("rudder loaded")
            // setRudder(window.rudder)
        })
    }, [])


    // const [identity] = useState(() => {
    //     return {
    //         id: window.rudder.getUserId(),
    //         traits: window.rudder.getUserTraits(),
    //     }
    // })

    const track = useCallback(() => {
        // if (identity.id === '') {
        //     console.log("no identity", identity, window.rudder.getUserId())
        //     // return;
        // }
        if (isTracking.current === true) return;

        isTracking.current = true
        // console.log("track started")
        // console.log("track started", window.rudder.getUserId(), window.rudder.getUserTraits(), "<<<")

        window.rudder.track("TEST:useRudderstackTrack", (...args) => {
            // console.log("track finished", args)
            isTracking.current = false
        })
    }, [])

    return { track }
}

export const SequencesPage = () => {
    const { t } = useTranslation();
    const { sequences, allSequenceInfluencersByCompanyId } = useSequences();
    const { allSequenceEmails } = useSequenceEmails();
    const [showCreateSequenceModal, setShowCreateSequenceModal] = useState<boolean>(false);

    const handleOpenCreateSequenceModal = () => {
        setShowCreateSequenceModal(true);
    };

    const { track } = useRudderstackTrack()

    useEffect(() => {
        track()
    }, [track])

    return (
        <Layout>
            <CreateSequenceModal
                title={t('sequences.sequenceModal') as string}
                showCreateSequenceModal={showCreateSequenceModal}
                setShowCreateSequenceModal={setShowCreateSequenceModal}
            />
            <div className="flex flex-col space-y-4 p-6">
                <div className="flex w-full">
                    <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">
                        {t('sequences.sequences')}
                    </h1>

                    <Button onClick={handleOpenCreateSequenceModal} className="ml-auto flex">
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <p className="self-center">{t('sequences.newSequence')}</p>
                    </Button>
                </div>
                <SequenceStats
                    totalInfluencers={allSequenceInfluencersByCompanyId?.length || 0}
                    openRate={
                        ((allSequenceEmails &&
                            allSequenceEmails?.length > 0 &&
                            allSequenceEmails?.filter(
                                (email) =>
                                    email.email_tracking_status === 'Link Clicked' ||
                                    email.email_tracking_status === 'Opened',
                            ).length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                    replyRate={
                        ((allSequenceEmails &&
                            allSequenceEmails.length > 0 &&
                            allSequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                    bounceRate={
                        ((allSequenceEmails &&
                            allSequenceEmails.length > 0 &&
                            allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                />

                <SequencesTable sequences={sequences} />
            </div>
        </Layout>
    );
};
