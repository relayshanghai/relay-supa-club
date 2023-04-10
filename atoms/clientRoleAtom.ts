import { atom } from 'jotai';

type TClientRole = {
    company_name: string;
    company_id: string;
};

export const clientRoleAtom = atom<TClientRole>({
    company_name: '',
    company_id: '',
});
