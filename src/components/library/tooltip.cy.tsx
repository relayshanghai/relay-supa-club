import { testMount } from '../../utils/cypress-app-wrapper';
import { Tooltip } from './tooltip';

const EmptyComponent = ({ delay }: { delay: number }) => (
    <>
        <Tooltip
            content="content"
            contentSize="small"
            detail="detail"
            position="top-right"
            link="link"
            linkText="linkText"
            highlight="highlight"
            tooltipClasses="tooltipClasses"
            delay={delay}
            enabled={true}
        >
            <p>test</p>
        </Tooltip>
    </>
);

describe('<Tooltip />', () => {
    it('should render without crashing', () => {
        testMount(<EmptyComponent delay={0} />);
    });
    it('should render without crashing with delay', () => {
        testMount(<EmptyComponent delay={1000} />);
        // shounlt not show tooltip for 1 second
        cy.contains('test').trigger('mouseover');
        cy.get('content').should('not.exist');
        cy.get('content').should('not.exist', { timeout: 999 });
        // should show tooltip after 1 second
        cy.contains('content');
    });
});
