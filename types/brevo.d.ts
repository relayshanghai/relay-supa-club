declare module 'sib-api-v3-sdk' {
    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/AddContactToList.md
     */
    export type AddContactToListType = { emails?: string[]; ids?: number[] };

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/CreateContact.md
     */
    export type CreateContactType<T extends Record<string, any> = undefined> = {
        email?: string;
        /**
         * Contact attributes are defined here.
         * Also, they should be uppercase
         * @see https://my.brevo.com/lists/add-attributes
         */
        attributes?: T;
        emailBlacklisted?: boolean;
        smsBlacklisted?: boolean;
        listIds?: number[];
        updateEnabled?: boolean;
        smtpBlacklistSender?: string[];
    };

    /**
     * @class ContactsApi
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md
     */
    export class ContactsApi {
        constructor();
        createContact: (createContact: CreateContactType) => Promise<any>;
        addContactToList: (listId: number, contactEmails: AddContactToListType) => Promise<any>;
    }

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md#addContactToList
     */
    export type AddContactToList = {
        constructFromObject: (data: AddContactToListType, obj?: any) => AddContactToListType;
    };

    /**
     * @see https://github.com/sendinblue/APIv3-nodejs-library/blob/master/docs/ContactsApi.md#createContact
     */
    export type CreateContact = {
        constructFromObject: (data: CreateContactType, obj?: any) => CreateContactType;
    };

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
        AddContactToListType: AddContactToListType,
        CreateContactType: CreateContactType,
        ContactsApi: ContactsApi,
        AddContactToList: AddContactToList,
        CreateContact: CreateContact,
        ApiClient: ApiClient,
    };

    export default Brevo;
}
