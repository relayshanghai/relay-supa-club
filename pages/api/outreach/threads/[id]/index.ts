import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getEmails } from 'src/utils/outreach/get-emails';

type ApiRequest = {
    id?: string;
};

const getHandler: ActionHandler = async (req, res) => {
    if (!req.profile) {
        throw new Error('Cannot get user profile');
    }

    const query: ApiRequest = req.query;

    if (!query.id) {
        throw new Error('Cannot get emails');
    }

    const emails = await getEmails(query.id);

    return res.status(200).json(emails);
};

export default ApiHandler({
    getHandler: getHandler,
});
