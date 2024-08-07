import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { OutreachesPage } from './outreaches-page';
import StoreProvider from 'src/store/Providers/StoreProvider';

const { pushMock, reactUseStateMock, reactUseMemoMock } = vi.hoisted(() => {
    return {
        pushMock: vi.fn(),
        reactUseStateMock: vi.fn(),
        reactUseMemoMock: vi.fn(),
    };
});

vi.mock('react', async () => {
    const originalReact = await vi.importActual('react');
    return {
        ...(originalReact as any),
        useState: reactUseStateMock,
        useMemo: reactUseMemoMock,
    };
});

vi.mock('next/router', () => ({
    useRouter: () => ({
        push: pushMock,
        query: { subscriptionId: 'sub_123' },
    }),
}));

vi.mock('src/hooks/use-rudderstack', () => ({
    useRudderstack: () => ({
        trackEvent: vi.fn(),
    }),
    useRudderstackTrack: () => ({
        track: vi.fn(),
    }),
}));

vi.mock('src/hooks/use-all-sequence-influencers-by-company-id', () => ({
    useAllSequenceInfluencersCountByCompany: () => ({
        allSequenceInfluencersCount: 0,
    }),
}));

vi.mock('src/hooks/use-sequences', () => ({
    useSequences: () => ({ sequences: null, refreshSequences: vi.fn() }),
}));

vi.mock('src/hooks/use-sequence-influencers', () => ({
    useSequenceInfluencers: () => ({ sequenceInfluencers: null }),
}));

vi.mock('src/hooks/use-sequence-emails', () => ({
    useSequenceEmails: () => ({ allSequenceEmails: null }),
}));

vi.mock('src/components/layout', () => ({
    Layout: ({ children }: any) => <>{children}</>,
}));

vi.mock('src/components/outreach/create-campaign-modal', () => ({
    CreateCampaignModal: ({
        children,
    }: {
        children: React.ReactNode;
        showCreateCampaignModal: boolean;
        setShowCreateCampaignModal: (showCreateCampaignModal: boolean) => void;
    }) => <>{children}</>,
}));

vi.mock('src/backend/database/sequence-email-template/sequence-email-template-entity', () => ({
    Step: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
    },
}));

describe('OutreachesPage Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('should render the page', () => {
        reactUseStateMock.mockReturnValue([false, () => null]);
        const { getByTestId } = render(
            <StoreProvider>
                <OutreachesPage />
            </StoreProvider>,
        );
        const outreachText = getByTestId('outreach-text');
        const templateLibraryButton = getByTestId('template-library-button');
        const createCampaignButton = getByTestId('create-campaign-button');
        expect(outreachText).toBeDefined();
        expect(templateLibraryButton).toBeDefined();
        expect(createCampaignButton).toBeDefined();
    });

    test('should open the create campaign modal', () => {
        reactUseStateMock.mockReturnValue([false, vi.fn()]);
        const { getByTestId } = render(
            <StoreProvider>
                <OutreachesPage />
            </StoreProvider>,
        );
        const createCampaignButton = getByTestId('create-campaign-button');
        createCampaignButton.click();
        expect(reactUseStateMock).toHaveBeenCalledWith(true);
    });
});
