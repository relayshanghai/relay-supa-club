import { GetServerSidePropsContext } from 'next';
import { logoutRedirect } from 'src/utils/auth';

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    return logoutRedirect(ctx);
};

export default function Logout() {
    return <></>;
}
