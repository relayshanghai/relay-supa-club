import type { NextApiRequest } from 'next';
import { Auth } from 'src/utils/handler/decorators/api-auth-decorator';

export const vercelCronAuth = async (req: NextApiRequest) => {
    const token = req.headers['authorization'];
    if (token !== `Bearer ${process.env.CRON_SECRET}`) {
        throw new Error('Invalid token');
    }
};

export const VercelCronAuth = (): MethodDecorator => Auth(vercelCronAuth);
