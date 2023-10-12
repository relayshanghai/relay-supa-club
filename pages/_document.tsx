import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const APPCUES_ACCOUNT_ID = process.env.APPCUES_ACCOUNT_ID ?? '000000';

const AppcuesScriptLoader = ({ accountId }: { accountId: string | number }) => {
    const preloadScript = `
      window.AppcuesSettings = { enableURLDetection: true };
    `;

    return [
        <Script key="appcues-settings" id="appcue-script" strategy="beforeInteractive">
            {preloadScript}
        </Script>,
        <Script key="appcues-loader" src={`\/\/fast.appcues.com\/${accountId}.js`} strategy="beforeInteractive" />,
    ];
};

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>{...AppcuesScriptLoader({ accountId: APPCUES_ACCOUNT_ID })}</Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
