import { mockInfluencers } from 'src/utils/api/email-engine/prototype-mocks';
import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { Button } from '../button';

export const SequencesPage = () => {
    const handleStartSequence = () => {
        //
    };
    return (
        <Layout>
            <h1>Sequences</h1>
            <Button onClick={handleStartSequence}>Start</Button>
            <SequenceTable influencers={mockInfluencers} />
        </Layout>
    );
};
