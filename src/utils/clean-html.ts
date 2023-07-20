import DOMPurify from 'dompurify';
/** accepts an HTML string and makes sure it doesn't have any scripts or anything dangerous in it */
export const cleanEmailBody = (body: string) => {
    if (!body) return '';
    return DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });
};
