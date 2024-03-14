import { testMount } from 'src/utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { PriceCard } from './price-card';

describe('SequencesPage', () => {
    before(() => {
        worker.start();
    });

    it('Should render the mock sequences in a table', () => {
        testMount(<PriceCard landingPage={false} period="monthly" priceTier="outreach" />);
    });
});
