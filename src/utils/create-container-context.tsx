import type { Context as ReactContext, Dispatch, PropsWithChildren, SetStateAction, FC } from 'react';
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

/**
 * Helper function for dynamically creating a context provider
 *
 * This is meant for Container (and sub-container) components for
 * beaming state (to avoid prop drilling) to the nearest Container of your target Presentational component
 *
 * [ Container 1 ]                       <- <ContainerProvider /> here
 *        |----------------|
 * [ Container 2 ]  [ Container 3 ]      <- useContainerContext here
 *                         |
 *                  [ Presentation 1 ]   <- this receives props (and triggers events)
 *
 * @see https://www.patterns.dev/posts/presentational-container-pattern
 */
export const createContainerContext = <TContext = any,>() => {
    const Context = createContext<ContextType<TContext> | undefined>(undefined);

    const Provider: FC<PropsWithChildren<{ initialValue: TContext }>> = ({
        children,
        initialValue,
    }: PropsWithChildren<{ initialValue: TContext }>) => (
        <ContainerProvider<TContext> context={Context} initialValue={initialValue}>
            {children}
        </ContainerProvider>
    );

    Provider.displayName = 'ContainerContextProvider';

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
