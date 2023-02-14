import { GetServerSidePropsContext } from 'next';
import { logoutRedirect } from 'src/utils/auth';

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    if (ctx.query.email) {
        return logoutRedirect(ctx, ctx.query.email.toString());
    } else {
        return logoutRedirect(ctx);
    }
};

export default function Logout() {
    return <></>;
}
