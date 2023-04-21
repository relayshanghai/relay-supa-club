import AdminSearch from './[id]';
import { worker } from 'src/mocks/browser';
import { TestProvider, testMount } from 'src/utils/cypress-app-wrapper';
import { clientRoleAtom } from 'src/atoms/client-role-atom';

describe('<AdminSearch />', () => {
    before(async () => {
        worker.start();
    });

    it('renders admin search panel', () => {
        testMount(<AdminSearch />);
    });

    it('Takes company name from Atom and render it', () => {
        testMount(
            <TestProvider
                initialValues={[
                    [
                        clientRoleAtom,
                        {
                            company_name: 'Test Company Name',
                            company_id: '124125151512',
                        },
                    ],
                ]}
            >
                <AdminSearch />
            </TestProvider>,
        );

        cy.contains('Test Company Name');
    });

    it('Takes another company name from Atom and render it', () => {
        testMount(
            <TestProvider
                initialValues={[
                    [
                        clientRoleAtom,
                        {
                            company_name: 'Test Company Name 2',
                            company_id: '239203592',
                        },
                    ],
                ]}
            >
                <AdminSearch />
            </TestProvider>,
        );

        cy.contains('Test Company Name 2');
    });
});
