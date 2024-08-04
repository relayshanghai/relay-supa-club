'use client';

import { type FC, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../redux';

const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
    const store = configureStore({});
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
