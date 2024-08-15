import { useLocalStorage } from './use-localstorage';

type NewPageType = {
    defaultPage: string;
};

export const useNewCRMPage = () => {
    const [val, setVal] = useLocalStorage<NewPageType>('crm-new-pages', {
        defaultPage: '/v2/sequences',
    });
    return {
        defaultPage: val.defaultPage,
        setDefaultPage: (page: string) => setVal({ ...val, defaultPage: page }),
    };
};
