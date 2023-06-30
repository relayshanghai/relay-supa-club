import Imap from 'imap'; // https://github.com/mscdex/node-imap
import nodeMailer from 'nodemailer'; //https://nodemailer.com/usage/
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';
//@ts-expect-error
import { MailListener } from 'mail-listener5';
export type IMAPCredentials = {
    /* 'user@example.com' */
    email: string;
    password: string;
    /** 'imap.example.com' */
    server: string;
    /** usually 993 or 143 for imap */
    port: number;
};

export type EmailerRequestBody = IMAPCredentials & {
    recipient: string;
    content: string;
};

type ResponseBody =
    | {
          data: {
              //
          };
      }
    | { error: string };

const DBStub: IMAPCredentials = {
    email: '',
    password: '',
    server: '',
    port: 993,
};

const recievedStub: any[] = [];
import { ParsedMail, simpleParser } from 'mailparser';

async function openInbox(imap: Imap) {
    return new Promise((resolve, reject) => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) reject(err);
            else resolve(box);
        });
    });
}

async function searchEmails(imap: Imap): Promise<number[]> {
    return new Promise((resolve, reject) => {
        imap.search(['ALL'], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function fetchEmails(imap: Imap, searchResults: number[]): Promise<ParsedMail[]> {
    return new Promise((resolve, reject) => {
        const f = imap.fetch(searchResults, { bodies: '' });
        const mails: ParsedMail[] = [];
        f.on('message', (msg, seqno) => {
            console.log({ msg, seqno });
            msg.on('body', (stream, info) => {
                console.log({ info });
                simpleParser(stream, (err, parsed) => {
                    if (err) reject(err);
                    else mails.push(parsed);
                });
            });
        });
        f.once('end', () => {
            resolve(mails);
        });
    });
}

/** Using IMAP directly instead of the helper library */
const listenForEmails = (imap: Imap) => {
    imap.once('ready', async function () {
        try {
            await openInbox(imap);
            const searchResults = await searchEmails(imap);
            const mails = await fetchEmails(imap, searchResults);
            for (const mail of mails) {
                console.log(mail.headers.get('subject'));
                console.log(mail.text);
            }
        } catch (err) {
            console.log(err);
        } finally {
            imap.end();
        }
    });

    imap.once('error', function (err: any) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
};

const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<ResponseBody>) => {
    const { email, password, server, port, recipient, content } = req.body as EmailerRequestBody;

    // TODO: save to DB under user's account? This is why oauth is probably better...
    if (!email || !password || !server || !port) {
        throw new RelayError('Missing required fields', httpCodes.BAD_REQUEST);
    }
    // if server is 'imap.example.com' then domain is 'example.com'
    const domain = server.split('.').slice(1).join('.');

    /** Mailer is for sending */
    const mailer = nodeMailer.createTransport({
        host: 'smtp.' + domain,
        // smtp should always be 465
        port: 465,
        secure: true,
        auth: {
            // 'user@example.com'
            user: email,
            pass: password,
        },
    });

    const mailOptions = {
        from: email,
        to: recipient,
        subject: 'Hello',
        text: content,
    };
    console.log({ mailOptions });

    mailer.sendMail(mailOptions, (error, info) => {
        if (error) {
            serverLogger(error, 'error');
        } else {
            serverLogger('Email sent: ' + info.response);
        }
    });

    const mailListener = new MailListener({
        username: email,
        password,
        host: server,
        port,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        mailbox: 'INBOX',
        markSeen: true,
        fetchUnreadOnStart: true,
        attachments: false,
    });
    mailListener.start();

    // stop listening
    //mailListener.stop();

    mailListener.on('server:connected', function () {
        console.log('imapConnected');
    });

    mailListener.on('mailbox', function (mailbox: any) {
        console.log('Total number of mails: ', mailbox.messages.total); // this field in mailbox gives the total number of emails
    });

    mailListener.on('server:disconnected', function () {
        console.log('imapDisconnected');
    });

    mailListener.on('error', function (err: any) {
        console.error(err);
    });

    mailListener.on('headers', function (headers: any, seqno: any) {
        console.log({ headers, seqno });
    });

    mailListener.on('body', function (body: any, seqno: any) {
        console.log({ body, seqno });
    });

    res.status(httpCodes.OK).json({ data: {} });
};

export default ApiHandler({
    postHandler,
});
