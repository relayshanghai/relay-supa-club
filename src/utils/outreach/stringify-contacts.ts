import type { From } from 'types/email-engine/account-account-message-get';

type StringifyContactsFn = (contacts: From | From[]) => string;

export const stringifyContacts: StringifyContactsFn = (contacts) => {
    if (Array.isArray(contacts)) {
        return contacts.map((contact) => stringifyContacts(contact)).join(',');
    }

    return `${contacts.name}|${contacts.address}`;
};
