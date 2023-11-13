import { testMount } from 'src/utils/cypress-app-wrapper';
import type { ChatContentProps } from './chat-content';
import type { MessageType } from './message';
import { useTranslation } from 'react-i18next';
import { AddToSequenceButton } from './add-to-sequence-button';

const MockComponent = ({
    handleSelectedInfluencersToOutreach,
    isOutreachLoading,
    areChatActionsDisabled,
    isOutreachButtonDisabled,
}: {
    handleSelectedInfluencersToOutreach: () => void;
    isOutreachLoading: boolean;
    areChatActionsDisabled: boolean;
    isOutreachButtonDisabled: boolean;
}) => {
    const { t } = useTranslation();
    const outReachDisabled = isOutreachLoading || areChatActionsDisabled || isOutreachButtonDisabled;
    return (
        <>
            <AddToSequenceButton
                buttonText={t('boostbot.chat.outreachSelected')}
                handleAddToSequenceButton={handleSelectedInfluencersToOutreach}
                outReachDisabled={outReachDisabled}
            />
        </>
    );
};

describe('Add to sequence button - BoostBot', () => {
    let handleSelectedInfluencersToOutreach: () => void;
    let stopBoostbot: () => void;
    const messages: MessageType[] = [
        { sender: 'Bot', type: 'text', text: 'test message 1' },
        { sender: 'User', type: 'text', text: 'test message 2' },
    ];
    let props: ChatContentProps;

    beforeEach(() => {
        handleSelectedInfluencersToOutreach = cy.stub();
        stopBoostbot = cy.stub();

        props = {
            messages,
            isSearchLoading: false,
            shouldShowButtons: true,
            handleSelectedInfluencersToOutreach,
            stopBoostbot,
            isOutreachLoading: false,
            areChatActionsDisabled: false,
            isOutreachButtonDisabled: false,
        };
    });
    it('Button is disabled while loading', () => {
        props.isOutreachLoading = true;
        testMount(<MockComponent {...props} />);

        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Button is disabled when chat actions are disabled', () => {
        props.areChatActionsDisabled = true;
        testMount(<MockComponent {...props} />);

        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Outreach button gets correctly disabled', () => {
        props.isOutreachButtonDisabled = true;
        testMount(<MockComponent {...props} />);

        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Calls correct actions when buttons are clicked', () => {
        testMount(<MockComponent {...props} />);

        cy.get('[data-testid="boostbot-button-outreach"]').click();
        cy.wrap(handleSelectedInfluencersToOutreach).should('have.been.called');
    });
});
