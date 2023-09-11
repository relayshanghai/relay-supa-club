import type { TestMountOptions } from './user-test-wrapper';

window.setMockRouter = (options: TestMountOptions) => {
    const pathname = options.pathname || '';
    const push = options?.pushStub ?? cy?.stub();
    const query = options.query || {};

    window.useRouter = () => ({
        route: pathname,
        pathname: pathname,
        query,
        asPath: pathname,
        push,
    });
};
