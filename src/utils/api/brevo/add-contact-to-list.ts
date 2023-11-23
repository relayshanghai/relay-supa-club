import type { AddContactToList } from 'sib-api-v3-sdk';
import Brevo from './brevo';

export const addContactToList = async (listId: number, params: AddContactToList) => {
    const api = new (Brevo('ContactsApi'))();

    return await api.addContactToList(listId, Brevo('AddContactToList').constructFromObject(params));
};
