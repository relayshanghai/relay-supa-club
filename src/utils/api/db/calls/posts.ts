type createPostParam = {
    campaign_id: string;
    influencer_id: string;
    post_id: string;
    likes_total: number;
    views_total: number;
    comments_total: number;
    orders_total: number;
    sales_total: number;
    sales_revenue: number;
};

export const createInfluencerPost = async (data: createPostParam) => {
    return { ...data, id: 0 };
};
