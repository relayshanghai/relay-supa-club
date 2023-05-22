// Generated by https://quicktype.io

export interface TikTokVideoDataRaw {
    success: boolean;
    media: Media;
}

export interface Media {
    itemInfo: ItemInfo;
}

export interface ItemInfo {
    itemStruct: ItemStruct;
}

export interface ItemStruct {
    id: string;
    desc: string;
    createTime: number;
    video: Video;
    author: Author;
    music: Music;
    challenges: Challenge[];
    stats: Stats;
    textExtra: TextExtra[];
    secret: boolean;
    privateItem: boolean;
    duetEnabled: boolean;
    stitchEnabled: boolean;
    shareEnabled: boolean;
}

export interface Author {
    id: string;
    uniqueId: string;
    nickname: string;
    avatarThumb: string;
    avatarMedium: string;
    avatarLarger: string;
    signature: string;
    verified: boolean;
    secUid: string;
    secret: boolean;
    ftc: boolean;
    openFavorite: boolean;
    commentSetting: number;
    duetSetting: number;
    stitchSetting: number;
    privateAccount: boolean;
}

export interface Challenge {
    id: string;
    title: string;
    desc: Desc;
    profileThumb: string;
    profileMedium: string;
    profileLarger: string;
    coverThumb: string;
    coverMedium: string;
    coverLarger: string;
}

export enum Desc {
    Empty = '',
    SIsForSkincare = 'S is for Skincare',
}

export interface Music {
    id: string;
    title: string;
    playUrl: string;
    coverThumb: string;
    coverMedium: string;
    coverLarge: string;
    authorName: string;
    original: boolean;
    duration: number;
}

export interface Stats {
    collectCount: number;
    diggCount: number;
    shareCount: number;
    commentCount: number;
    playCount: number;
}

export interface TextExtra {
    awemeId: string;
    start: number;
    end: number;
    hashtagName: string;
    hashtagId: string;
    type: number;
    isCommerce: boolean;
    subType: number;
}

export interface Video {
    id: string;
    height: number;
    width: number;
    duration: number;
    ratio: string;
    cover: string;
    originCover: string;
    dynamicCover: string;
    playAddr: string;
    downloadAddr: string;
}
