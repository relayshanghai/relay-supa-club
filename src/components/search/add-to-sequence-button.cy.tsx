/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import type { AddToSequenceButtonProps } from './add-to-sequence-button';
import { AddToSequenceButton } from './add-to-sequence-button';
import type * as types from '../../../types';

const props: AddToSequenceButtonProps = {
    allSequenceInfluencersIqDataIdsAndSequenceNames: [
        { iqdata_id: '123', sequenceName: 'test' },
        { iqdata_id: '456', sequenceName: 'test2' },
        { iqdata_id: '789', sequenceName: 'test3' },
    ],
    creatorProfile: {
        user_id: 'xxx',
    } as types.CreatorAccount,
    platform: 'youtube',
};

describe('<AddToSequenceButton />', () => {
    before(async () => {
        worker.start();
    });
    it('shows add to sequence modal if creator profile user_id does not match list of already added sequence influencers', () => {
        testMount(<AddToSequenceButton {...props} />);
        cy.contains('button', 'Add to sequence').click();
        cy.contains('No sequence created yet');
    });
    it('shows already added modal if creator profile user_id matches list of already added sequence influencers', () => {
        const alreadyAddedProps = {
            ...props,
            creatorProfile: {
                user_id: '123',
            } as types.CreatorAccount,
        };
        testMount(<AddToSequenceButton {...alreadyAddedProps} />);
        cy.contains('button', 'Add to sequence').click();
        cy.contains('Influencer has already been added to sequence: test');
        cy.contains('button', 'Close').click();
        cy.contains('Influencer has already been added to sequence: test').should('not.exist');
    });
});

export {};
