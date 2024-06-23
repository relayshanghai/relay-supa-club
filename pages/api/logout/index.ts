import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { serialize } from 'cookie';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { createHandler } from 'src/utils/handler/create-handler';
import { DELETE, GET } from 'src/utils/handler/decorators/api-decorator';
import { Req } from 'src/utils/handler/decorators/api-req-decorator';
import { Res } from 'src/utils/handler/decorators/api-res-decorator';

class LogoutHandler {
    @GET()
    async simulateLogout(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
        const supabaseCookie = req.cookies[`supabase-auth-token`];

        const supabase = createServerSupabaseClient({ req, res });
        await supabase.auth.signOut();

        res.setHeader('Set-Cookie', [
            serialize(`supabase-auth-token`, supabaseCookie as string, {
                httpOnly: true,
                path: '/',
            }),
        ]);
        return { message: 'simulating logout' };
    }

    @DELETE()
    async logout(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
        res.setHeader('Set-Cookie', [
            serialize(`supabase-auth-token`, '', {
                httpOnly: true,
                path: '/',
                maxAge: -1,
            }),
        ]);
        return { message: 'logout success' };
    }
}

export default createHandler(LogoutHandler);
