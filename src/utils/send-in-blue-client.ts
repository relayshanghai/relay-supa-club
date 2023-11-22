// @ts-nocheck

// Docs in https://github.com/sendinblue/APIv3-nodejs-library
//@ts-ignore
import SendInBlue from 'sib-api-v3-sdk'; // no types for this library
import { BOOSTBOT_DOMAIN } from 'src/constants';

const SIB_API_KEY = process.env.SIB_API_KEY;
if (!SIB_API_KEY) throw new Error('SIB_API_KEY not set');

const defaultClient = SendInBlue.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = SIB_API_KEY;

const apiInstance = new SendInBlue.TransactionalEmailsApi();

export const sendEmail = ({
    email,
    name,
    html,
    subject,
}: {
    email: string;
    name?: string;
    subject?: string;
    html: string;
}) => {
    const sendSmtpEmail = new SendInBlue.SendSmtpEmail();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};
