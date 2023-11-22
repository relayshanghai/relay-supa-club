import type { CreateContactType } from 'sib-api-v3-sdk';
import Brevo from './brevo';

export const createContact = async (params: CreateContactType) => {
    const api = new (Brevo('ContactsApi'))();

    return await api.createContact(Brevo('CreateContact').constructFromObject(params));
};
