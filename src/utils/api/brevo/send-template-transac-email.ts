import { BOOSTBOT_DOMAIN } from 'src/constants';
import Brevo from './brevo';

export type SmtpMailType = {
    id: number;
    name: string;
    subject: string;
    sender: {
        name: string;
        email: string;
        id: number;
    };
    replyTo: string;
    toField: string;
    htmlContent: string;
};

const apiInstance = new (Brevo('TransactionalEmailsApi'))();

export const sendEmailChangeVerificationEmail = async (email: string, name: string, verificationLink: string) => {
    //@ts-ignore
    const templateInfo: SmtpMailType = await apiInstance.getSmtpTemplate(7); // 7 is the id of the template for email change verification on Brevo
    const { htmlContent, subject } = templateInfo;
    const sendSmtpEmail = new (Brevo('SendSmtpEmail'))();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.htmlContent = htmlContent.replace('https://verification.link', verificationLink);
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
    //@ts-ignore
    const templateInfo: SmtpMailType = await apiInstance.getSmtpTemplate(5); // 5 is the id of the template for password reset on Brevo
    const { htmlContent, subject } = templateInfo;
    const sendSmtpEmail = new (Brevo('SendSmtpEmail'))();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.htmlContent = htmlContent.replace('https://reset.link', resetLink);
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};
