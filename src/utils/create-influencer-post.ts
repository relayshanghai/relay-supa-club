import { createInfluencerPost as _createInfluencerPost } from './api/db/calls/posts';

export const createInfluencerPost = async (data: any) => {
    return _createInfluencerPost(data);
};
