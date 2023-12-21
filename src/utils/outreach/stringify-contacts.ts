import type { From, ReplyTo } from 'types/email-engine/account-account-message-get';

type Contact = From | ReplyTo;

type StringifyContactsFn = (contacts: Contact | Contact[]) => string;

export const stringifyContacts: StringifyContactsFn = (contacts) => {
    if (Array.isArray(contacts)) {
        return contacts.map((contact) => stringifyContacts(contact)).join(',');
    }

    return `${contacts.name}|${contacts.address}`;
};
