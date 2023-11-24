import Brevo from 'sib-api-v3-sdk';

const brevo = <A extends keyof typeof Brevo>(api: A, key?: string): (typeof Brevo)[A] => {
    const SIB_API_KEY = process.env.SIB_API_KEY ?? key;

    if (!SIB_API_KEY) {
        throw new Error('SIB_API_KEY not set');
    }

    Brevo.ApiClient.instance.authentications['api-key'].apiKey = SIB_API_KEY;

    return Brevo[api];
};

export default brevo;
