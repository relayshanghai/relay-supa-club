import type { From } from 'types/email-engine/account-account-message-get';

type ParseContactsFn = (contacts: string) => From[];

export const parseContacts: ParseContactsFn = (value) => {
    const contacts = value.split(',');
    if (contacts.length > 1) {
        return contacts.map((contact) => parseContacts(contact)[0]);
    }

    const [name, address] = contacts[0].split('|');

    // handle empty name to replace with the address when email engine returns "|address" only
    return [{ name: name || address, address }];
};
