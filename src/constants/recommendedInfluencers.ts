/** temporary list to have some influencers that will show up as recommended on the landing page to show off this feature */
const dummyRecommendedInfluencers = [
    'youtube/UCh_ugKacslKhsGGdXP0cRRA',
    'youtube/UCwyXamwtzfDIvRjEFcqNmSw',
    'youtube/UCpEhnqL0y41EpW2TvWAHD7Q',
    'instagram/25025320',
    'instagram/208560325',
    'youtube/UCbCmjCuTUZos6Inko4u57UQ',
];

/**
 * from https://docs.google.com/spreadsheets/d/10emnFuv2_qnZ_6kf9cyolCCoZmN4d1fQWDDkXc1aN2s/edit#gid=1470421470
 *
 * TODO: For now we can only handle 1000 influencers per platform, so if we exceed that we will need to reimplement some things: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/352
 */
const recommendedInfluencersRelayURL = [
    'tiktok/6811277756471919622',
    'tiktok/6917178256732292097',
    'youtube/UCd7ioa99LnjUlhbZb0iU6CA',
    'tiktok/6807141470069048326',
    'youtube/UCnUOo0U4wI2b9R4ghXmKblw',
    'youtube/UC7KBkZcmOcXuIKNx8lGwkjw',
    'tiktok/6820253736356496389',
    'youtube/UCHeFV2atoLtgdKH4iu29orA',
    'youtube/UCKd4c6Ke8GsuUWf2BnOI4WA',
    'youtube/UC6Tpyk4x-1ChP5m_mOucGgw',
    'youtube/UC_cXT8WCyJ6P7BwYm0tWFMw',
    'youtube/UCYc8QG3cdJSmSTdb-mMBOKw',
    'youtube/UCYBd1grhWrz6caCX7bJDnMw',
    'youtube/UCO5IhWS7_CIU1HoAkffBzcg',
    'youtube/UCSBql9Ly64k1J2m5wN6h-6A',
    'youtube/UC5OAsU1qv2VgySaDy1vwoMg',
    'youtube/UCcauIhuhzDF3x2PEhhOpIIA',
    'youtube/UCnaU4LFeXbgTAfYHbLf86LQ',
    'youtube/UCScEHLR_P9ksMHyqF5deRYg',
    'youtube/UCz7ddsLpm4R57voSyVG-k6A',
    'youtube/UCE5hoPfKusdD0md1fYjp3zw',
    'youtube/UCRbSSddD_k5A4K7SW96ev2Q',
    'youtube/UCQEdzt8D9PqnqRa2IxF_eCA',
    'youtube/UCu2s141YSBTWKJu8zmRJFeg',
    'tiktok/101882497042456576',
    'youtube/UCb6l4Z_lHbWR6_lM6mDf5Ng',
    'youtube/UCnmdmsM59JghOMbdQFa0lnQ',
    'youtube/UC_JTai-FQ09tVB1_TeO9u7w',
    'youtube/UCgE4HPH5dqdEbqtE9_jzWng',
    'youtube/UCQYMRkp4h_sQh5DWE0uw6pw',
    'youtube/UCwzfmK3YWOGPjrF0UDvzQ-Q',
    'youtube/UCxXqRGeCRCMgZaQIrAP03mw',
    'youtube/UCO5IhWS7_CIU1HoAkffBzcg',
    'tiktok/6755858394870072325',
    'tiktok/6771676594685641734',
    'youtube/UCbSxXSWGv4NPrRWxzikNbmw',
    'youtube/UC2-nif4wvOqT6QVsBX3NOpA',
    'youtube/UCuNKAAuJjj6Rnqua8miiO8w',
    'youtube/UCUXBN3246cBoKTCcWZ9pFig',
    'instagram/235640130',
    'youtube/UCAl07YZamCkD9BU4GXUMocQ',
    'youtube/UCJ9lYSdFSSr_d8wrb2neIHA',
    'youtube/UClMlXTxpTNMZRE4AEjlc5RA',
    'youtube/UCpLxBM2LNI9MUY4bxMNEWXA',
    'youtube/UClF6jkehTBHkkg04AqJfIgg',
    'youtube/UCd7MMxZLnYVREjGJLXYJvCA',
    'youtube/UCyB9hcpkGckOyxOgyq2B7AQ',
    'youtube/UCxANAj3t7VX-OWqog-wflQg',
    'youtube/UCDtmwG5j62UAt9KWAqKkE8A',
    'youtube/UCH5YwlO6r8O8miT1ryatYYQ',
    'youtube/UCz0xc3fiZ7wGfgh64n5CVaQ',
    'youtube/UColGq9X_Fi9LedYSK6ZfrkQ',
    'youtube/UCUcqiS57gSxHvWZNuBSXReg',
    'youtube/UCGVp0b2POpyE9CDUX4kQViw',
    'youtube/UCvIgYVKzRbxEBoxsSXoR8rw',
    'youtube/UCh7LPHafeQH85zLxOCiFGAQ',
    'youtube/UCxraGSSd657UBSSl-yM_luA',
    'tiktok/7000523424628982789',
    'youtube/UCJB1o_c7tehlH5srZaCvzRQ',
    'tiktok/6803892283004666886',
    'tiktok/6805726743551640581',
];

export const recommendedInfluencers = [...dummyRecommendedInfluencers, ...recommendedInfluencersRelayURL];

export const isRecommendedInfluencer = (platform: string, user_id: string) =>
    recommendedInfluencers.includes(`${platform}/${user_id}`);
