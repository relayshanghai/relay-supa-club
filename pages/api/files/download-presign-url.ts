import type { NextApiHandler } from 'next';
import StorageService from 'src/backend/domain/storage/storage';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

const getUserAgentType = (userAgent: string) => {
    if (/axios|node-fetch/i.test(userAgent)) {
        return 'axios/fetch';
    } else if (/Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent)) {
        return 'browser';
    } else {
        return 'unknown';
    }
};

const getHandler: NextApiHandler = async (req, res) => {
    const { path } = req.query;
    const userAgent = getUserAgentType(req.headers['user-agent'] as string);
    if (userAgent === 'browser') {
        res.redirect(`/inbox/download/${path}`);
        return;
    }
    const signedUrl = await StorageService.getService().createDownloadSignUrl(path as string);
    res.redirect(signedUrl);
};

export default ApiHandlerWithContext({ getHandler, requireAuth: false });
