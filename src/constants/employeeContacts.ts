export const SALES_REP_EMAIL = 'amy.hu@relay.club';
export const RELAY_EXPERT_EMAIL = 'sophia@relay.club';

const additionalEmployeeEmails = process.env.EMPLOYEE_EMAILS ? process.env.EMPLOYEE_EMAILS.split(',') : [];
export const EMPLOYEE_EMAILS = [
    'sophia@relay.club',
    'jim@relay.club',
    'jacob@relay.club',
    'daniel@relay.club',
    'ellie@relay.club',
    'amy.hu@relay.club',
    'amina@relay.club',
    'eve@relay.club',
    'nes@relay.club',
    'mikaela@relay.club',
    'kathleen@relay.club',
    'april@relay.club',
    'shane@relay.club',
    'reg@relay.club',
    'trini@relay.club',
    'jun@relay.club',
    'james@relay.club',
    'mayank@relay.club',
    'mary@relay.club',
    'caroline@relay.club',
    'kathlyn@relay.club',
    'gege@relay.club',
    'ariane@relay.club',
    'anne@relay.club',
    'gold@relay.club',
    'mars@relay.club',
    'thatsonmars1@gmail.com',
    'allaine@relay.club',
    'brendan@relay.club',
    'max@relay.club',
    'aloisa@relay.club',
    'echaoeoen@gmail.com',
    ...additionalEmployeeEmails,
];

/** prod accounts listed at https://email.relay.club/admin/accounts */
const additionalQuickSendEmailAccounts = process.env.QUICK_SEND_EMAIL_ACCOUNTS
    ? process.env.QUICK_SEND_EMAIL_ACCOUNTS.split(',')
    : [];
export const QUICK_SEND_EMAIL_ACCOUNTS = [
    'egtljwhuz89pfkmj', // jacob@boostbot.ai
    '6nitzaf4gajlnt5c', // kirsten@boostbot.ai
    'r4s32poko4nqxv08', // kirsten@boostbot.ai on staging
    '3tsfh97079jmgnni', // anne_ulike@beauty.boostbot.ai
    'm9cxoxn96dk5viwz', // support+cus_obskepogcl3egn@boostbot.ai
    ...additionalQuickSendEmailAccounts,
];

export const PREVIEW_PAGE_ALLOW_EMAIL_LIST = [
    'jacob@relay.club',
    'adriennesamson27@gmail.com',
    'anne_ulike@beauty.boostbot.ai',
    // fvovl2wcvqd95cq9
    'b.mcbride@live.ca',
    '78916347@qq.com',
    // n1as8g25a8et32mm
    'support+cus_oud44sdk1m5avr@boostbot.ai',
    // v1v4t0yhlra1g1mi
    'support+cus_p2vdkam3afpdeg@boostbot.ai',
    'support+cus_obskepogcl3egn@boostbot.ai',
    'info@acebott.com',
    // znyrkk4q5g7gebsv
    'yguo@finalroundai.com',
    'tech@relay.club',
];
