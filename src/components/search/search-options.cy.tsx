import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { rest } from 'msw';
import { SearchPage } from './search-page';

const companyId = 'ad942d94-41bb-441a-a4e6-66169854b865';

const influencerSearchResults = {
    total: 8431344,
    accounts: [
        {
            account: {
                user_profile: {
                    user_id: 'UCq-Fj5jknLsUf-MWSy4_brA',
                    username: 'tseries',
                    handle: 'tseries',
                    url: 'https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA',
                    picture:
                        'https://yt3.googleusercontent.com/v_PwNTRdcmpaEU6zh9wytm0ERtq2BOAmBQvr1QyZstphlpcPUqjbX3wqIvSRR9bWIgSjmRUJcwE=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'T-Series',
                    is_verified: true,
                    followers: 239000000,
                    engagements: 22137,
                    engagement_rate: 0.0000926234309623431,
                    avg_views: 1377292,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCbCmjCuTUZos6Inko4u57UQ',
                    username: 'checkgate',
                    custom_name: 'CoComelon',
                    handle: 'CoComelon',
                    url: 'https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ',
                    picture:
                        'https://yt3.googleusercontent.com/ytc/AL5GRJXB8VWrb_icZhpFOXZJLxGWI-56sDEx8gzXC47VDw=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'Cocomelon - Nursery Rhymes',
                    is_verified: false,
                    followers: 157000000,
                    engagements: 55476,
                    engagement_rate: 0.00035335031847133757,
                    avg_views: 10511175,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCpEhnqL0y41EpW2TvWAHD7Q',
                    username: 'setindia',
                    custom_name: 'setindia',
                    handle: 'SETIndia',
                    url: 'https://www.youtube.com/channel/UCpEhnqL0y41EpW2TvWAHD7Q',
                    picture:
                        'https://yt3.googleusercontent.com/_FmN-rgQ1Wkp9j9xDBbcPHCq5p7pSutDh_QP-CfOz8LPTrYhnWHmDoucvtz7BXy34wsdVu5uZA4=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'SET India',
                    is_verified: true,
                    followers: 154000000,
                    engagements: 658,
                    engagement_rate: 0.000004272727272727273,
                    avg_views: 33531,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
                    username: 'MrBeast6000',
                    custom_name: 'MrBeast6000',
                    handle: 'MrBeast',
                    url: 'https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA',
                    picture:
                        'https://yt3.googleusercontent.com/ytc/AL5GRJVuqw82ERvHzsmBxL7avr1dpBtsVIXcEzBPZaloFg=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'MrBeast',
                    is_verified: true,
                    followers: 139000000,
                    engagements: 7621103,
                    engagement_rate: 0.05482807913669065,
                    avg_views: 156317314,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                    username: 'PewDiePie',
                    handle: 'PewDiePie',
                    url: 'https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                    picture:
                        'https://yt3.googleusercontent.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'PewDiePie',
                    is_verified: true,
                    followers: 111000000,
                    engagements: 287674,
                    engagement_rate: 0.0025916576576576577,
                    avg_views: 3551438,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCk8GzjMOrta8yxDcKfylJYw',
                    custom_name: 'KidsDianaShow',
                    handle: 'KidsDianaShow',
                    url: 'https://www.youtube.com/channel/UCk8GzjMOrta8yxDcKfylJYw',
                    picture:
                        'https://yt3.googleusercontent.com/ytc/AL5GRJWPo8m4nLhbJ7U1S-lXndOcxwQJhsaGQsHvkCXMSw=s480-c-k-c0x00ffffff-no-rj',
                    fullname: '✿ Kids Diana Show',
                    is_verified: true,
                    followers: 110000000,
                    engagements: 79752,
                    engagement_rate: 0.0007250181818181818,
                    avg_views: 17085756,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCJplp5SjeGSdVdwsfb9Q7lQ',
                    handle: 'LikeNastyaofficial',
                    url: 'https://www.youtube.com/channel/UCJplp5SjeGSdVdwsfb9Q7lQ',
                    picture:
                        'https://yt3.googleusercontent.com/ytc/AL5GRJWdjxTrvDKtL7mmABKfxUMXRLojq_5xB37iqD1-ng=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'Like Nastya',
                    is_verified: true,
                    followers: 105000000,
                    engagements: 49634,
                    engagement_rate: 0.0004727047619047619,
                    avg_views: 8357365,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCvlE5gTbOvjiolFlEm-c_Ow',
                    custom_name: 'VladandNiki',
                    handle: 'VladandNiki',
                    url: 'https://www.youtube.com/channel/UCvlE5gTbOvjiolFlEm-c_Ow',
                    picture:
                        'https://yt3.googleusercontent.com/RlnpUc0SBCmYvseTqUqAfYeyHw0nHcmqQIVS0vMcTKpk3gQAY0ZZY1JpUxxjLPAYROhDYKub=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'Vlad and Niki',
                    is_verified: true,
                    followers: 95800000,
                    engagements: 33846,
                    engagement_rate: 0.0003532985386221294,
                    avg_views: 10651949,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
                    username: 'WWEFanNation',
                    custom_name: 'WWE',
                    handle: 'WWE',
                    url: 'https://www.youtube.com/channel/UCJ5v_MCY6GNUBTO8-D3XoAg',
                    picture:
                        'https://yt3.googleusercontent.com/ytc/AL5GRJUNCk6JcNlEyBPH_K8x4kPzIR5NtFRNaCBebSG7vjo=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'WWE',
                    is_verified: true,
                    followers: 94200000,
                    engagements: 4425,
                    engagement_rate: 0.00004697452229299363,
                    avg_views: 117248,
                },
                audience_source: 'any',
            },
            match: {},
        },
        {
            account: {
                user_profile: {
                    user_id: 'UCFFbwnve3yF62-tVXkTyHqg',
                    username: 'zeemusiccompany',
                    handle: 'zeemusiccompany',
                    url: 'https://www.youtube.com/channel/UCFFbwnve3yF62-tVXkTyHqg',
                    picture:
                        'https://yt3.googleusercontent.com/EEGERwlaKJd27zSEPQF3d__-tPyppIgFfKvNfBkWa7ssMKBWqQUbuCTLe-kAnTB1r6kJQVxyxwY=s480-c-k-c0x00ffffff-no-rj',
                    fullname: 'Zee Music Company',
                    is_verified: true,
                    followers: 93900000,
                    engagements: 13163,
                    engagement_rate: 0.00014018104366347178,
                    avg_views: 716326,
                },
                audience_source: 'any',
            },
            match: {},
        },
    ],
    cost: 0,
    shown_accounts: [],
};

describe('SearchOptions', () => {
    before(() => {
        worker.start();
    });
    it('Should render search page', () => {
        testMount(<SearchPage companyId={companyId} />);

        cy.contains('Results per page').should('exist');
    });

    it('Should show top default influencers', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(influencerSearchResults));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);
        cy.get('[href="/influencer/youtube/UCq-Fj5jknLsUf-MWSy4_brA"]').should('exist');
    });

    it('Should add topic tags to search', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(influencerSearchResults));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators{enter}');
            cy.get('input').type('yomrwhite{enter}');
        });
        cy.contains('alligators').should('exist');
        cy.contains('yomrwhite').should('exist');
    });

    it('should be empty when we remove topic tags', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(influencerSearchResults));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators{enter}');
            cy.get('input').type('yomrwhite{enter}');
        });

        // cy.getByTestId('search-topics').within(() => {
        //     cy.get('input').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
        // });

        cy.get('#remove-tag-alligators').should('exist').click();
        cy.get('#remove-tag-yomrwhite').should('exist').click();

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').should('be.empty');
        });
    });

    it('Should delete topic tags when pressing backspace', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(influencerSearchResults));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.getByTestId('search-topics').within(() => {
            cy.get('input')
                .type('alligators{enter}')
                .type('yomrwhite{enter}')
                .type('{backspace}{backspace}{backspace}{backspace}{backspace}')
                .should('have.value', 'yomrw');
        });
    });
});
