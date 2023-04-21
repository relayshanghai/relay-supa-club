import { atom } from 'jotai';

type ClientRoleAtom = {
    company_name: string;
    company_id: string;
};

export const clientRoleAtom = atom<ClientRoleAtom>({
    company_name: '',
    company_id: '',
});
