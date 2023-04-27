import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

import type { sheets_v4 } from 'googleapis';
import { google } from 'googleapis';
import type { GoogleAuth } from 'google-auth-library';
import { serverLogger } from '../logger-server';

export const DEFAULT_SHEET_ID = 'Sheet1';

const credentials = {
    type: 'service_account',
    project_id: 'recommended-influencers-sheet',
    private_key_id: 'da4216555259955a834d5f990e92139f7cbc4658',
    private_key: '',
    client_email: 'relay-club-service-account@recommended-influencers-sheet.iam.gserviceaccount.com',
    client_id: '116281726721191170632',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/relay-club-service-account%40recommended-influencers-sheet.iam.gserviceaccount.com',
    client_secret: '',
};

// If modifying these scopes, delete token.json.
export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

const CREDENTIALS_PATH = path.join(process.cwd(), 'src/utils/google/credentials.json');

const loadSecretIntoCredentialsJson = async () => {
    const clientSecret = process.env.GOOGLE_PRIVATE_KEY;
    if (!clientSecret) {
        throw new Error('Missing GOOGLE_PRIVATE_KEY');
    }
    credentials.private_key = clientSecret;
    await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(credentials));
};

/**
 * Request or authorization to call google APIs.
 */
export async function authorizeGoogle() {
    await loadSecretIntoCredentialsJson();
    serverLogger('Authorizing Google API...');

    const client = new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: CREDENTIALS_PATH,
    });
    serverLogger('Authorized Google API.');
    return client as GoogleAuth;
}

export const findExistingFileByName = async (auth: GoogleAuth, name: string) => {
    const drive = google.drive({ version: 'v3', auth });
    // check if spreadsheet exists by searching google drive for title

    const filesList = await drive.files.list({
        q: `name = '${name.toUpperCase()}'`,
        fields: 'files(id, name)',
    });

    const files = filesList.data.files;
    // if spreadsheet exists, get id and check if all the sheets are there.
    if (!files || files.length === 0) throw new Error('no files found');

    const fileId = files[0].id;
    if (!fileId) throw new Error('no file id found');
    return fileId;
};

/**
 * Create a folder and prints the folder ID
 * @return{obj} folder Id
 * */
export async function createFolder(auth: GoogleAuth, name: string) {
    const drive = google.drive({ version: 'v3', auth });

    const foldersList = await drive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
    });

    const folders = foldersList.data.files;
    // find folder with name
    const folder = folders?.find((f) => f.name === name);
    if (folder) {
        return folder.id;
    }

    const newFolder = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
    });
    return newFolder.data.id;
}

/**
 * Change the file's modification timestamp.
 * @param{string} fileId Id of the file to move
 * @param{string} folderId Id of the folder to move
 * @return{obj} file status
 * */
export async function moveFileToFolder(auth: GoogleAuth, fileId: string, folderId: string) {
    const service = google.drive({ version: 'v3', auth });

    try {
        // Retrieve the existing parents to remove
        const file = await service.files.get({
            fileId,
            fields: 'parents',
        });
        if (!file.data.parents) throw new Error('no parents found');
        // Move the file to the new folder
        const previousParents = file.data.parents
            .map(function (parent) {
                //@ts-ignore
                return parent.id;
            })
            .join(',');
        const files = await service.files.update({
            fileId: fileId,
            addParents: folderId,
            removeParents: previousParents,
            fields: 'id, parents',
        });
        return files.status;
    } catch (err) {
        throw err;
    }
}

/** check if spreadsheet exists by searching google drive for title. If it doesn't, create it and add to the passed in folder name. Returns spreadsheet ID */
export const getOrCreateSpreadsheetByTitle = async (auth: GoogleAuth, title: string) => {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
        const spreadsheetId = await findExistingFileByName(auth, title);
        if (!spreadsheetId) throw new Error('no file id found');
        serverLogger('existingSheet:' + title + ' id: ' + spreadsheetId);
        return spreadsheetId;
    } catch (error) {
        const createParams: sheets_v4.Params$Resource$Spreadsheets$Create = {
            requestBody: {
                properties: { title },
                sheets: [{ properties: { title: DEFAULT_SHEET_ID } }],
            },
        };

        const newSheet = await sheets.spreadsheets.create(createParams);
        const spreadsheetId = newSheet.data.spreadsheetId;

        if (!spreadsheetId) throw new Error('no file id found');
        return spreadsheetId;
    }
};
