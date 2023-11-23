declare module 'sib-api-v3-sdk' {
    // MODELS
    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailSender.md
     */
    export type SendSmtpEmailSenderType = {
        name?: string;
        email?: string;
        id?: number;
    };

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailTo.md
     */
    export type SendSmtpEmailToType = { name?: string; email: string };

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailBcc.md
     */
    export type SendSmtpEmailBccType = SendSmtpEmailToType;

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailCc.md
     */
    export type SendSmtpEmailCcType = SendSmtpEmailToType;

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailReplyTo.md
     */
    export type SendSmtpEmailReplyTo = SendSmtpEmailToType;

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailAttachment.md
     */
    export type SendSmtpEmailAttachmentType = {
        url?: string;
        /**
         * Base64 encoded chunk data of the attachment generated on the fly
         */
        content?: string;
        name?: string;
    };

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/SendSmtpEmailMessageVersions.md
     */
    export type SendSmtpEmailMessageVersionsType = Pick<
        SendSmtpEmail,
        'to' | 'params' | 'bcc' | 'cc' | 'replyTo' | 'subject'
    >;
    // END OF MODELS

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md
     */
    export class ContactsApi {
        /**
         * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md#createContact
         */
        createContact: <T>(createContact: CreateContact<T>) => Promise<any>;
        /**
         * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md#addContactToList
         */
        addContactToList: (listId: number, contactEmails: AddContactToList) => Promise<any>;
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/AddContactToList.md
     */
    export class AddContactToList {
        static constructFromObject: (data: AddContactToList, obj?: any) => AddContactToList;
        emails?: string[];
        ids?: number[];
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/CreateContact.md
     */
    export class CreateContact<A extends Record<string, any> = undefined> {
        static constructFromObject: <T>(data: CreateContact<T>, obj?: any) => CreateContact<T>;
        email?: string;
        /**
         * Contact attributes are defined here.
         * Also, they should be uppercase
         * @see https://my.brevo.com/lists/add-attributes
         */
        attributes?: A;
        emailBlacklisted?: boolean;
        smsBlacklisted?: boolean;
        listIds?: number[];
        updateEnabled?: boolean;
        smtpBlacklistSender?: string[];
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/TransactionalEmailsApi.md
     */
    export class TransactionalEmailsApi {
        /**
         * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/TransactionalEmailsApi.md#sendtransacemail
         */
        sendTransacEmail: (email: SendSmtpEmail) => Promise<any>;
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md#createContact
     */
    export class SendSmtpEmail {
        static constructFromObject: (data: SendSmtpEmail, obj?: any) => SendSmtpEmail;
        sender?: SendSmtpEmailSenderType;
        to?: SendSmtpEmailToType[];
        bcc?: SendSmtpEmailBccType[];
        cc?: SendSmtpEmailCcType[];
        htmlContent?: string;
        textContent?: string;
        subject?: string;
        replyTo?: SendSmtpEmailReplyToType;
        attachment?: SendSmtpEmailAttachmentType[];
        headers?: Record<string, any>;
        templateId?: number;
        params?: Record<string, any>;
        messageVersions?: SendSmtpEmailMessageVersionsType[];
        tags?: string[];
        scheduledAt?: string;
        batchId?: string;
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/src/ApiClient.js
     */
    export type ApiClient = {
        instance: {
            authentications: {
                'api-key': {
                    apiKey: string;
                };
            };
        };
    };

    const Brevo = {
        ContactsApi: ContactsApi,
        AddContactToList: AddContactToList,
        CreateContact: CreateContact,
        TransactionalEmailsApi: TransactionalEmailsApi,
        SendSmtpEmail: SendSmtpEmail,
        ApiClient: ApiClient,
    };

    export default Brevo;
}
