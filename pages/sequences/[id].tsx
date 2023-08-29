import { useRouter } from 'next/router';
import { SequencePage } from 'src/components/sequences/sequence-page';

export default function Page() {
    const router = useRouter();
    const { id } = router.query;
    if (!id || typeof id !== 'string') {
        return (
            <div>
                <h1>404</h1>
            </div>
        );
    }
    return <SequencePage sequenceId={id} />;
}
