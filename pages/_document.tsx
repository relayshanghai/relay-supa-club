import { Html, Head, Main, NextScript } from 'next/document';
import { birdEatsBugScript } from 'src/components/analytics/bird-eats-bugs';
export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
                <script type="text/javascript" dangerouslySetInnerHTML={{ __html: birdEatsBugScript }} />
            </body>
        </Html>
    );
}
