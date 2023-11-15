// export the paths to the Image element as recommended by NextJs https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets
export interface ImageURLTypes {
    [key: string]: string;
}

export const screenshots: ImageURLTypes = {
    campaignsPageCn: '/assets/imgs/screenshots/campaigns-cn.png',
    campaignsPageEn: '/assets/imgs/screenshots/campaigns-en.png',
    discoverPageCn: '/assets/imgs/screenshots/discover-cn.png',
    discoverPageEn: '/assets/imgs/screenshots/discover-en.png',
    filtersPageCn: '/assets/imgs/screenshots/filters-cn.png',
    filtersPageEn: '/assets/imgs/screenshots/filters-en.png',
    performancePageCn: '/assets/imgs/screenshots/performance-cn.png',
    performancePageEn: '/assets/imgs/screenshots/performance-en.png',
    boostBot:'/assets/imgs/screenshots/boostBotFirstInteraction.png',
    inbox:'/assets/imgs/screenshots/inboxEmailView.png',
    sequence:'/assets/imgs/screenshots/sequencePage-KOLSelected.png'
};
