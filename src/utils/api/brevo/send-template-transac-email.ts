import { BOOSTBOT_DOMAIN } from 'src/constants';
import Brevo from './brevo';
import templates from './templates';

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
    // ignore ts rules in next line as the library does not have types
    //@ts-ignore
    const templateInfo: SmtpMailType = await apiInstance.getSmtpTemplate(templates.emailChangeVerification);
    const { htmlContent, subject } = templateInfo;
    const sendSmtpEmail = new (Brevo('SendSmtpEmail'))();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.htmlContent = htmlContent.replace('https://verification.link', verificationLink); // These placeholder texts are set in the Brevo templates so that we can replace them
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
    // ignore ts rules in next line as the library does not have types
    //@ts-ignore
    const templateInfo: SmtpMailType = await apiInstance.getSmtpTemplate(templates.passwordReset);
    const { htmlContent, subject } = templateInfo;
    const sendSmtpEmail = new (Brevo('SendSmtpEmail'))();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.htmlContent = htmlContent.replace('https://reset.link', resetLink); // These placeholder texts are set in the Brevo templates so that we can replace them
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendInviteEmail = async (email: string, senderName: string, companyName: string, inviteLink: string) => {
    // ignore ts rules in next line as the library does not have types
    //@ts-ignore
    const templateInfo: SmtpMailType = await apiInstance.getSmtpTemplate(templates.invite);
    const { htmlContent, subject } = templateInfo;
    const sendSmtpEmail = new (Brevo('SendSmtpEmail'))();
    sendSmtpEmail.sender = { name: BOOSTBOT_DOMAIN, email: `no-reply@${BOOSTBOT_DOMAIN}` };
    sendSmtpEmail.to = [{ email, name: email }];
    const replacedHtml = htmlContent
        .replace('https://invite.link', inviteLink)
        .replace('{{ contact.COMPANYNAME }}', companyName)
        .replace('Someone', senderName); // These placeholder texts are set in the Brevo templates so that we can replace them
    sendSmtpEmail.htmlContent = replacedHtml;
    sendSmtpEmail.subject = subject;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};
