import httpCodes from 'src/constants/httpCodes';

export default async function handler() {
    const options: ResponseInit = {
        status: httpCodes.FORBIDDEN,
        headers: {
            'content-type': 'application/json',
        },
    };
    return new Response(
        JSON.stringify({
            error: 'API Error',
        }),
        options,
    );
}
