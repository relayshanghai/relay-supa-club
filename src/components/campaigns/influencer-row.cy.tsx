/// <reference types="@testing-library/cypress" />
// @ts-check

import type { CampaignCreatorDB } from '../../utils/api/db';
import React from 'react';
import type { InfluencerRowProps } from './influencer-row';
import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import InfluencerRow from './influencer-row';
import type { TableColumns } from './campaign-influencers-table';
import StoreProvider from 'src/store/Providers/StoreProvider';

const creator: CampaignCreatorDB = {
    id: '175c7699-f53d-4c0c-bf04-e11deea7899e',
    created_at: '2023-03-29T12:08:42.10964+00:00',
    status: 'to contact',
    campaign_id: '2fefe314-b457-4812-95a5-9d9d73e2eb0d',
    updated_at: null,
    relay_creator_id: null,
    creator_model: null,
    creator_token: null,
    interested: null,
    email_sent: null,
    publication_date: null,
    payment_rate: 0,
    rate_currency: 'USD',
    payment_details: null,
    payment_status: "'unpaid'::text",
    paid_amount: 0,
    payment_currency: 'USD',
    address: null,
    sample_status: "'unsent'::text",
    tracking_details: null,
    reject_message: null,
    brief_opened_by_creator: null,
    need_support: null,
    next_step: null,
    avatar_url:
        'https://yt3.googleusercontent.com/v_PwNTRdcmpaEU6zh9wytm0ERtq2BOAmBQvr1QyZstphlpcPUqjbX3wqIvSRR9bWIgSjmRUJcwE=s480-c-k-c0x00ffffff-no-rj',
    username: 'tseries',
    fullname: 'T-Series',
    link_url: 'https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA',
    creator_id: 'UCq-Fj5jknLsUf-MWSy4_brA',
    platform: 'youtube',
    added_by_id: '2d6c17e7-7aae-4122-a3d2-2e0e22841581',
    influencer_social_profiles_id: null,
};

const testColumns: TableColumns[] = [
    {
        header: 'account',
        type: 'account',
        name: 'account',
    },
    {
        header: 'contact',
        type: 'contact',
        name: 'contact',
    },
    {
        header: 'creatorStatus',
        type: 'select',
        name: 'status',
    },
];

const tabs = [
    { label: 'toContact', value: 'to contact' },
    { label: 'contacted', value: 'contacted' },
    { label: 'inProgress', value: 'in progress' },
    { label: 'confirmed', value: 'confirmed' },
    { label: 'posted', value: 'posted' },
    { label: 'rejected', value: 'rejected' },
    { label: 'ignored', value: 'ignored' },
];

const makeStubs = () => {
    const handleDropdownSelect = cy.stub();
    const setInlineEdit = cy.stub();
    const editingModeTrue = cy.stub();
    const updateCampaignCreator = cy.stub();
    const setToEdit = cy.stub();
    const deleteCampaignCreator = cy.stub();
    const openMoveInfluencerModal = cy.stub();
    const openManageInfluencerModal = cy.stub();
    const openAddPostModal = cy.stub();
    const openNotes = cy.stub();
    const setShowMoveInfluencerModal = cy.stub();
    return {
        handleDropdownSelect,
        setInlineEdit,
        editingModeTrue,
        updateCampaignCreator,
        setToEdit,
        deleteCampaignCreator,
        openMoveInfluencerModal,
        openNotes,
        setShowMoveInfluencerModal,
        openManageInfluencerModal,
        openAddPostModal,
    };
};

describe('<InfluencerRow />', () => {
    before(() => {
        worker.start();
    });
    it('renders with influencer data', () => {
        const props: InfluencerRowProps = {
            index: 1,
            ...makeStubs(),
            creator,
            tabs,
            showMoveInfluencerModal: false,
            tabStatus: creator.status,
            visibleColumns: testColumns,
        };

        testMount(
            <StoreProvider>
                <InfluencerRow {...props} />
            </StoreProvider>,
        );
        cy.contains('@tseries');
        cy.contains('To Contact');
    });

    it('only shows creator contact info after clicking a "View Contact Info" button', () => {
        const props: InfluencerRowProps = {
            index: 1,
            ...makeStubs(),
            creator,
            tabs,
            showMoveInfluencerModal: false,
            tabStatus: creator.status,
            visibleColumns: testColumns,
        };
        testMount(
            <StoreProvider>
                <InfluencerRow {...props} />
            </StoreProvider>,
        );
        cy.findByTestId('contacts-skeleton').should('not.exist');
        cy.get('a[href="https://www.facebook.com/tseriesmusic"]').should('not.exist');

        cy.contains('View Contact Info').click();
        // shows loading spinner
        cy.findByTestId('contacts-skeleton').should('exist');
        // shows contact info
        cy.get('a[href="https://www.facebook.com/tseriesmusic"]').should('exist');
    });

    it('shows only three action buttons - move influencer, manage, delete, when status is inContact from the test dat', () => {
        const props: InfluencerRowProps = {
            index: 1,
            ...makeStubs(),
            creator,
            tabs,
            showMoveInfluencerModal: false,
            tabStatus: creator.status,
            visibleColumns: testColumns,
        };
        testMount(
            <StoreProvider>
                <InfluencerRow {...props} />
            </StoreProvider>,
        );

        cy.get('[data-testid="move-influencer-button"]').should('exist');
        cy.get('[data-testid="manage-button"]').should('exist');
        cy.get('[data-testid="delete-creator"]').should('exist');
        cy.get('[data-testid="open-notes-button"]').should('have.class', 'hidden');
    });
});

export {};
