import httpCodes from 'src/constants/httpCodes';

export const config = {
    runtime: 'experimental-edge',
};

export default async function handler() {
    return new Response(
        JSON.stringify({
            error: 'API Error',
        }),
        {
            status: httpCodes.FORBIDDEN,
            headers: {
                'content-type': 'application/json',
            },
        },
    );
}
