import { google } from 'googleapis';
import { DEFAULT_SHEET_ID, authorizeGoogle } from 'src/utils/google/sheet-helpers';

// pull the id from the middle of the url of the spreadsheet
// https://docs.google.com/spreadsheets/d/10emnFuv2_qnZ_6kf9cyolCCoZmN4d1fQWDDkXc1aN2s/edit#gid=1470421470
const spreadsheetId = '1m2rXucvo_Cder-1iSr0-A24Ef2-3N0Q2yPN4f3-4mcE';
// the sheet must share access with our service account email for the project
// relay-club-service-account@recommended-influencers-sheet.iam.gserviceaccount.com

const parseSheetInfluencerIds = (profileLinkColumn: string[]) => {
    return profileLinkColumn
        ?.slice(1)
        .filter((link) => typeof link === 'string' && link.includes('https://app.relay.club/influencer/'))
        .map((link) => link?.split('https://app.relay.club/influencer/')[1]);
};

export const getInfluencerIdsFromSheet = async () => {
    const auth = await authorizeGoogle();
    const sheets = google.sheets({ version: 'v4', auth });

    const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: DEFAULT_SHEET_ID, // means get the whole sheet (tab in bottom of the spreadsheet)
        majorDimension: 'COLUMNS', // we are looking to pull a whole column, so this will put each column into an array
    });

    const profileLinkColumn = sheetData.data.values?.find(
        (column) => column[0] === 'relay.club profile link',
    ) as string[];

    if (!profileLinkColumn || profileLinkColumn.length === 0) {
        throw new Error('No profile link column found. It must be named "relay.club profile link".');
    }

    return parseSheetInfluencerIds(profileLinkColumn);
};
