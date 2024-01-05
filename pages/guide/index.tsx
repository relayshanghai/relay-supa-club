import { Layout } from 'src/components/layout';
import { GuideComponent } from 'src/components/guide';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Guide = () => {
    const router = useRouter();
    const {
        isReady,
        query: { show_video },
    } = router;
    const [routing, setRouting] = useState(true);

    useEffect(() => {
        if (isReady) {
            setRouting(false);
        }
    }, [isReady]);

    const shouldShowVideo = typeof show_video === 'string' && show_video === 'false' ? false : true;

    return (
        <Layout>
            <GuideComponent showVideo={!routing && shouldShowVideo} />
        </Layout>
    );
};

export default Guide;
