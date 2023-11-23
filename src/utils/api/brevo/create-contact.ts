import type { CreateContactType } from 'sib-api-v3-sdk';
import Brevo from './brevo';

type RelayBrevoContactAttributes = {
    EMAIL?: string;
    LASTNAME?: string;
    FIRSTNAME?: string;
    SMS?: string;
    WHATSAPP?: string;
};

export const createContact = async (params: CreateContactType<RelayBrevoContactAttributes>) => {
    const api = new (Brevo('ContactsApi'))();

    return await api.createContact(Brevo('CreateContact').constructFromObject(params));
};
