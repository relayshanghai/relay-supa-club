import { atom } from 'jotai';

type ClientRoleAtom = {
    companyName: string;
    companyId: string;
};

export const clientRoleAtom = atom<ClientRoleAtom>({
    companyName: '',
    companyId: '',
});
