import Smartlook from 'smartlook-client';

const NEXT_PUBLIC_APIKEY = process.env.NEXT_PUBLIC_SMARTLOOK_APIKEY;
export const initSmartlook = () => {
    if (!NEXT_PUBLIC_APIKEY) {
        return false;
    }
    if (!Smartlook.initialized()) {
        return Smartlook.init(NEXT_PUBLIC_APIKEY);
    }
    return true;
};

export const useSmartlook = () => {
    const identify = (userId: string, props: Record<string, any> = {}) => {
        if (!initSmartlook()) return;
        Smartlook.identify(userId, props);
    };
    return { identify };
};
