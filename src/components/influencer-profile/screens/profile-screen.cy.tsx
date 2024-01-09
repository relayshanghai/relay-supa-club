import { testMount } from 'src/utils/cypress-app-wrapper';
import { ProfileScreen } from './profile-screen';
import { inManagerDummyInfluencers } from 'src/components/sequences/in-manager-dummy-sequence-influencers';
import { ProfileScreenProvider } from './profile-screen-context';
import { mapProfileToFormData } from 'src/components/inbox/helpers';
import { worker } from 'src/mocks/browser';
import { flattenInfluencerData } from 'src/utils/api/boostbot/helper';
import { defaultLandingPageInfluencerSearch } from 'cypress/e2e/intercepts';

const profile = inManagerDummyInfluencers[0];
const profileValue = mapProfileToFormData(profile);
const influencerData = flattenInfluencerData(defaultLandingPageInfluencerSearch);

describe('<ProfileScreen />', () => {
    if (!profileValue) return;
    beforeEach(() => {
        worker.start();
    });
    it('Mounts', () => {
        testMount(
            <ProfileScreenProvider initialValue={profileValue}>
                <ProfileScreen
                    influencerData={influencerData.influencers[0]}
                    profile={profile}
                    selectedTab="notes"
                    onUpdate={cy.stub()}
                    onCancel={cy.stub()}
                />
            </ProfileScreenProvider>,
        );
    });
    it('Can access report page by clicking name and handle', () => {
        testMount(
            <ProfileScreenProvider initialValue={profileValue}>
                <ProfileScreen
                    influencerData={influencerData.influencers[0]}
                    profile={profile}
                    selectedTab="notes"
                    onUpdate={cy.stub()}
                    onCancel={cy.stub()}
                />
            </ProfileScreenProvider>,
        );
        cy.contains('social_handle').should('have.attr', 'href', '/influencer/youtube/UCzCjoQvfXbVt8n6KO9YLumg');
        cy.contains('Influencer Name').should('have.attr', 'href', '/influencer/youtube/UCzCjoQvfXbVt8n6KO9YLumg');
    });
});
