import { atom } from 'jotai';

type ClientRoleAtom = {
    companyName: string;
    companyId: string;
    emailEngineAccountId: string;
    sequenceSendEmail: string;
};

export const clientRoleAtom = atom<ClientRoleAtom>({
    companyName: '',
    companyId: '',
    emailEngineAccountId: '',
    sequenceSendEmail: '',
});
