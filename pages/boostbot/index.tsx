/* eslint-disable no-console */
import { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import type { CreatorAccountWithTopics } from 'pages/api/boostbot/get-influencers';
import { Layout } from 'src/components/layout';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useSequences } from 'src/hooks/use-sequences';
import { useUser } from 'src/hooks/use-user';
import { OpenBoostbotPage } from 'src/utils/analytics/events';
import type { UserProfile } from 'types';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};
// UserProfile is the unlocked influencer/generated report type. Used for checking which influencers are already unlocked and which are not.
// const isUserProfile = (influencer: Influencer) => 'type' in influencer;

const Boostbot = () => {
    // const { t } = useTranslation();
    const { unlockInfluencers: _unlockInfluencersTest } = useBoostbot({});
    const [_isInitialLogoScreen, _setIsInitialLogoScreen] = usePersistentState('boostbot-initial-logo-screen', true);
    const [influencers, _setInfluencers] = usePersistentState('boostbot-influencers', []);
    const [selectedInfluencers, _setSelectedInfluencers] = usePersistentState('boostbot-selected-influencers', {});
    const _selectedInfluencersData = Object.keys(selectedInfluencers).map((key) => influencers[Number(key)]);
    const { trackEvent: track } = useRudderstack();
    const { sequences: allSequences } = useSequences();
    const _sequences = allSequences?.filter((sequence) => !sequence.deleted);
    // const [_isSearchLoading, _setIsSearchLoading] = useState(false);
    // const [isUnlockOutreachLoading, setIsUnlockOutreachLoading] = useState(false);
    const { profile: _profileTest } = useUser();
    // const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    // const [sequence, setSequence] = useState<Sequence | undefined>(
    //     sequences?.find((sequence) => sequence.name === defaultSequenceName),
    // );
    console.log('root log boostbot');
    // useEffect(() => {
    //     console.log('log-2 start sequence');
    //     if (sequences && !sequence) {
    //         setSequence(sequences[0]);
    //     }
    //     console.log('log-2 end sequence');
    // }, [sequence, sequences]);

    // const { createSequenceInfluencer: _createSeqInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    // const { sendSequence: _sendSequenceTest } = useSequence(sequence?.id);
    const [_hasUsedUnlock, _setHasUsedUnlock] = usePersistentState('boostbot-has-used-unlock', false);
    // const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    // const [areChatActionsDisabled, setAreChatActionsDisabled] = useState(false);

    useEffect(() => {
        console.log('log-1 Boosebot opened');
        track(OpenBoostbotPage.eventName);
    }, [track]);

    return <Layout>LMAO</Layout>;
};

export default Boostbot;
