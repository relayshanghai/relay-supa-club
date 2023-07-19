export const headers = {
    'X-Api-Key': process.env.DATA_KEY || '',
    'content-type': 'application/json',
    Authorization: `Basic ${Buffer.from(process.env.DATA_USER + ':' + process.env.DATA_PASS).toString('base64')}`,
};
