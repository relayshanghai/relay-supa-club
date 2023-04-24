export const extractInfluencer = (userProfile: any) => {
    const email = userProfile.contacts.find((v: any) => v.type === 'email');

    return {
        name: userProfile.fullname,
        email: email.value,
        avatar_url: userProfile.picture,
        // address: "",
    };
};

export const extractInfluencerProfile = (userProfile: any) => {
    return (influencer: any) => {
        return {
            url: userProfile.url,
            platform: userProfile.platform,
            influencer: influencer.id,
        };
    };
};
