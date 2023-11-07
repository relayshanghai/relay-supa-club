import { testMount } from '../../../utils/cypress-app-wrapper';
import boostbotGetInfluencers from '../../../mocks/api/boostbot/get-influencers.json';
import { BoostbotAudienceLocationCell } from './boostbot-audience-location-cell';
import { decimalToPercent } from 'src/utils/formatter';

describe('<BoostbotAudienceLocationCell />', () => {
    const influencer = boostbotGetInfluencers[0];
    const row = { original: influencer, index: 0 } as any;

    const geoWeight = influencer.audience_geo.countries[0].weight;
    const geoPercentage = decimalToPercent(geoWeight, 0);
    const expectedCountryPercentage = influencer.audience_geo.countries[0].name + ' ' + geoPercentage;

    it('Should display at least one country percentage data when hover on the tooltip', () => {
        testMount(<BoostbotAudienceLocationCell row={row} />);
        cy.get('[data-cy="tooltip"]').trigger('mouseover', { force: true });
        cy.contains(expectedCountryPercentage);
    });

    it('should has the correct width of the country percentage', () => {
        testMount(<BoostbotAudienceLocationCell row={row} />);
        cy.getByTestId('boostbot-location-cell-country-1').should('have.attr', 'style', `width: ${geoPercentage};`);
    });
});
