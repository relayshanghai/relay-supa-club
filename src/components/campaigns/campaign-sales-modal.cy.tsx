import { testMount } from '../../utils/cypress-app-wrapper';
import { CampaignSalesModal } from './campaign-sales-modal';

describe('CampaignSalesModal', () => {
    it('Should render the modal', () => {
        testMount(<CampaignSalesModal show={true} setShow={cy.stub().withArgs(false)} onAddSales={cy.stub()} />);
        cy.contains('Add Sales (USD)');
        cy.contains('$');
        cy.contains('Add Amount');
    });

    it('Should call onAddSales function with typed amount', () => {
        const onAddSales = cy.spy();
        testMount(<CampaignSalesModal show={true} setShow={cy.stub().withArgs(false)} onAddSales={onAddSales} />);
        cy.get('[data-testid=campaign-sales-input]').type('999999');
        cy.contains('Add Amount').click();
        cy.wrap(onAddSales).should('be.calledWith', 999999);
    });
});
