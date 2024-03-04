import type { From, ReplyTo } from 'types/email-engine/account-account-message-get';

type Contact = From | ReplyTo;

type StringifyContactsFn = (contacts: Contact | Contact[]) => string;
/**
 * @deprecated
 * @param contacts
 * @returns
 */
export const stringifyContacts: StringifyContactsFn = (contacts) => {
    if (Array.isArray(contacts)) {
        return contacts.map((contact) => stringifyContacts(contact)).join(',');
    }

    return `${'name' in contacts ? contacts.name : contacts.address}|${contacts.address}`;
};
