import type { Context as ReactContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type ContextType<T> = { state: T; setState: Dispatch<SetStateAction<T>> };

type Props<T = any> = PropsWithChildren<{
    context: ReactContext<ContextType<T> | undefined>;
    initialValue: T;
}>;

const ContainerProvider = <T = { [key: string]: any },>({ children, context: Context, initialValue }: Props<T>) => {
    const [state, setState] = useState<T>(initialValue);

    const context = useMemo(() => {
        return { state, setState };
    }, [state, setState]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const createContainerContext = <TContext = any,>() => {
    const Context = createContext<ContextType<TContext> | undefined>(undefined);

    const Provider = ({ children, initialValue }: PropsWithChildren<{ initialValue: TContext }>) => (
        <ContainerProvider<TContext> context={Context} initialValue={initialValue}>
            {children}
        </ContainerProvider>
    );

    const useContainerContext = () => {
        const context = useContext(Context);

        if (context === undefined) {
            throw new Error('useContainerContext must be within ContainerContext.Provider');
        }

        return context;
    };

    return {
        Context,
        Provider,
        useContainerContext,
    };
};
