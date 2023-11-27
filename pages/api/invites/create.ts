import type { NextApiHandler } from 'next';
import { emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createInviteErrors } from 'src/errors/company';
import { getProfileByEmail, getExistingInvite, insertInvite, getCompanyById } from 'src/utils/api/db';
import type { InvitesDB } from 'src/utils/api/db/types';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { getHostnameFromRequest } from 'src/utils/get-host';
import { serverLogger } from 'src/utils/logger-server';
import { sendEmail } from 'src/utils/send-in-blue-client';

export interface CompanyCreateInvitePostBody {
    email: string;
    company_id: string;
    name: string;
    companyOwner?: boolean;
}
export type CompanyCreateInvitePostResponse = InvitesDB;

const formatEmail = (companyName: string, token: string, appUrl: string) => {
    const link = `${appUrl}/signup/invite?${new URLSearchParams({
        token,
    })}`;
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="format-detection" content="telephone=no"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>You were invited to join an organization on BoostBot!</title><style type="text/css" emogrify="no">#outlook a { padding:0; } .ExternalClass { width:100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } table td { border-collapse: collapse; mso-line-height-rule: exactly; } .editable.image { font-size: 0 !important; line-height: 0 !important; } .nl2go_preheader { display: none !important; mso-hide:all !important; mso-line-height-rule: exactly; visibility: hidden !important; line-height: 0px !important; font-size: 0px !important; } body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; } img { outline:none; text-decoration:none; -ms-interpolation-mode: bicubic; } a img { border:none; } table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; } th { font-weight: normal; text-align: left; } *[class="gmail-fix"] { display: none !important; } </style><style type="text/css" emogrify="no"> @media (max-width: 600px) { .gmx-killpill { content: ' \03D1';} } </style><style type="text/css" emogrify="no">@media (max-width: 600px) { .gmx-killpill { content: ' \03D1';} .r0-o { background-image: url('https://img.mailinblue.com/5527223/images/content_library/original/6551da4094aee427d13730c3.png') !important; background-size: auto !important; border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } .r1-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 320px !important } .r2-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 320px !important } .r3-i { padding-bottom: 20px !important; padding-left: 15px !important; padding-right: 15px !important; padding-top: 20px !important } .r4-c { box-sizing: border-box !important; display: block !important; valign: top !important; width: 100% !important } .r5-o { border-style: solid !important; width: 100% !important } .r6-i { background-color: #ffffff !important; padding-bottom: 24px !important; padding-left: 0px !important; padding-right: 0px !important; padding-top: 24px !important } .r7-c { box-sizing: border-box !important; text-align: left !important; valign: top !important; width: 100% !important } .r8-o { border-style: solid !important; margin: 0 auto 0 0 !important; width: 100% !important } .r9-i { background-color: #ffffff !important } .r10-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 100% !important } .r11-o { background-size: auto !important; border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } .r12-i { padding-bottom: 160px !important; padding-left: 10px !important; padding-right: 10px !important; padding-top: 20px !important } .r13-i { padding-left: 0px !important; padding-right: 0px !important } .r14-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } .r15-i { padding-bottom: 12px !important; padding-left: 12px !important; padding-right: 12px !important; padding-top: 8px !important; text-align: center !important } .r16-i { padding-bottom: 48px !important; padding-left: 24px !important; padding-right: 24px !important; padding-top: 24px !important; text-align: left !important } .r17-c { box-sizing: border-box !important; padding: 0 !important; text-align: center !important; valign: top !important; width: 100% !important } .r18-o { border-style: solid !important; margin: 0 auto 0 auto !important; margin-bottom: 15px !important; margin-top: 15px !important; width: 100% !important } .r19-i { padding: 0 !important; text-align: center !important } .r20-r { background-color: #7c3aed !important; border-color: #7c3aed !important; border-radius: 4px !important; border-width: 0px !important; box-sizing: border-box; height: initial !important; padding: 0 !important; padding-bottom: 12px !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 12px !important; text-align: center !important; width: 100% !important } .r21-i { background-color: #7c3aed !important } .r22-c { box-sizing: border-box !important; text-align: center !important; valign: middle !important; width: 320px !important } .r23-c { box-sizing: border-box !important; display: block !important; valign: middle !important; width: 100% !important } .r24-i { padding-bottom: 15px !important; padding-top: 15px !important } body { -webkit-text-size-adjust: none } .nl2go-responsive-hide { display: none } .nl2go-body-table { min-width: unset !important } .mobshow { height: auto !important; overflow: visible !important; max-height: unset !important; visibility: visible !important; border: none !important } .resp-table { display: inline-table !important } .magic-resp { display: table-cell !important } } </style><!--[if !mso]><!--><style type="text/css" emogrify="no">@import url("https://fonts.googleapis.com/css2?family=Poppins"); </style><!--<![endif]--><style type="text/css">p, h1, h2, h3, h4, ol, ul { margin: 0; } a, a:link { color: #7c3aed; text-decoration: underline } .nl2go-default-textstyle { color: #3b3f44; font-family: Poppins, verdana; font-size: 16px; line-height: 1.5; word-break: break-word } .default-button { color: #ffffff; font-family: Poppins, verdana; font-size: 16px; font-style: normal; font-weight: bold; line-height: 1.15; text-decoration: none; word-break: break-word } .default-heading1 { color: #1F2D3D; font-family: Poppins, verdana; font-size: 36px; word-break: break-word } .default-heading2 { color: #1F2D3D; font-family: Poppins, verdana; font-size: 32px; word-break: break-word } .default-heading3 { color: #1F2D3D; font-family: Poppins, verdana; font-size: 24px; word-break: break-word } .default-heading4 { color: #1F2D3D; font-family: Poppins, verdana; font-size: 18px; word-break: break-word } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } .no-show-for-you { border: none; display: none; float: none; font-size: 0; height: 0; line-height: 0; max-height: 0; mso-hide: all; overflow: hidden; table-layout: fixed; visibility: hidden; width: 0; } </style><!--[if mso]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">a:link{color: #7c3aed; text-decoration: underline;}</style></head><body bgcolor="#ffffff" text="#3b3f44" link="#7c3aed" yahoo="fix" style="background-color: #ffffff;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" class="nl2go-body-table" width="100%" style="background-color: #ffffff; width: 100%;"><tr><td> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r0-o" style="background-color: #ffffff; background-image: url('https://img.mailinblue.com/5527223/images/content_library/original/6551da4094aee427d13730c3.png'); background-position: center; background-repeat: no-repeat; background-size: auto; font-size: 0; table-layout: fixed; width: 100%;"><tr><td valign="top"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" align="center" class="r2-o" style="table-layout: fixed; width: 600px;"><tr><td class="r3-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r4-c" style="background-color: #ffffff; font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r5-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r6-i" style="background-color: #ffffff; padding-bottom: 24px; padding-left: 15px; padding-right: 15px; padding-top: 24px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r7-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="240" class="r8-o" style="table-layout: fixed; width: 240px;"><tr><td style="font-size: 0px; line-height: 0px;"> <img src="https://img.mailinblue.com/5527223/images/content_library/original/65517d78fa88ae58995b8628.png" width="240" border="0" style="display: block; width: 100%;"></td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" align="center" class="r2-o" style="table-layout: fixed; width: 600px;"><tr><td valign="top" class="r9-i" style="background-color: #ffffff;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r11-o" style="table-layout: fixed; width: 100%;"><tr><td class="r12-i" style="padding-bottom: 160px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r4-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r5-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r13-i"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r10-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r14-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r15-i nl2go-default-textstyle" style="color: #3b3f44; font-family: Poppins,verdana; font-size: 16px; line-height: 1.5; word-break: break-word; padding-bottom: 12px; padding-left: 12px; padding-right: 12px; padding-top: 8px; text-align: center;"> <div><h1 class="default-heading1" style="margin: 0; color: #1f2d3d; font-family: Poppins,verdana; font-size: 36px; word-break: break-word;">You were invited to join ${companyName} </h1></div> </td> </tr></table></td> </tr><tr><td class="r7-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r8-o" style="table-layout: fixed; width: 100%;"><tr><td align="left" valign="top" class="r16-i nl2go-default-textstyle" style="color: #3b3f44; font-family: Poppins,verdana; font-size: 16px; line-height: 1.5; word-break: break-word; padding-bottom: 48px; padding-left: 24px; padding-right: 24px; padding-top: 24px; text-align: left;"> <div><p style="margin: 0;">Someone on this team invited you to join their company<br> </p><p style="margin: 0;">Click the link below to set up your account and get started on BoostBot!</p></div> </td> </tr></table></td> </tr><tr><td class="r17-c" align="center" style="align: center; padding-bottom: 15px; padding-top: 15px; valign: top;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="300" class="r18-o" style="background-color: #7c3aed; border-collapse: separate; border-color: #7c3aed; border-radius: 4px; border-style: solid; border-width: 0px; table-layout: fixed; width: 300px;"><tr><td height="18" align="center" valign="top" class="r19-i nl2go-default-textstyle" style="word-break: break-word; background-color: #7c3aed; border-radius: 4px; color: #ffffff; font-family: Poppins, verdana; font-size: 16px; font-style: normal; line-height: 1.15; padding-bottom: 12px; padding-left: 5px; padding-right: 5px; padding-top: 12px; text-align: center;"> <a href="${link}" class="r20-r default-button" target="_blank" title="Go login" data-btn="1" style="font-style: normal; font-weight: bold; line-height: 1.15; text-decoration: none; word-break: break-word; word-wrap: break-word; display: block; -webkit-text-size-adjust: none; color: #ffffff; font-family: Poppins, verdana; font-size: 16px;"> <span>Set up my account</span></a> </td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r14-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r21-i" style="background-color: #7c3aed;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" align="center" class="r2-o" style="table-layout: fixed; width: 600px;"><tr><td class="r3-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="middle" class="r23-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r5-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r13-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r10-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="165" class="r14-o" style="border-collapse: separate; border-radius: 8px; table-layout: fixed; width: 165px;"><tr><td class="r24-i" style="border-radius: 8px; font-size: 0px; line-height: 0px; padding-bottom: 15px; padding-top: 15px;"> <img src="https://img.mailinblue.com/5527223/images/content_library/original/65573fed6f2be3bec6cfaeb0.png" width="165" border="0" style="display: block; width: 100%; border-radius: 8px;"></td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table></td> </tr></table></td> </tr></table></body></html>
    `;
};
const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    const { email, company_id, name, companyOwner } = req.body as CompanyCreateInvitePostBody;

    if (!email || !company_id)
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.missingRequiredFields });

    let company = null;

    try {
        company = await getCompanyById(company_id);
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Error', {
                error: 'Cannot get company',
                company_id,
            });
        });
    }

    if (!company || !company.name) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.missingRequiredFields });
    }

    if (!emailRegex.test(email))
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.invalidEmail });

    if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
    }

    try {
        const { data: existingAccount } = await getProfileByEmail(email);
        if (existingAccount) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.userAlreadyExists });
        }
    } catch (error) {
        serverLogger(error);
    }
    const existingInvite = await getExistingInvite(email, company_id);

    if (
        existingInvite?.expire_at &&
        existingInvite.used === false &&
        Date.now() < new Date(existingInvite.expire_at).getTime()
    )
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.inviteExistsAndHasNotExpired });

    const insertData = await insertInvite({ email, company_id, company_owner: companyOwner });

    const { appUrl } = getHostnameFromRequest(req);

    try {
        await sendEmail({
            email,
            name,
            subject: 'You have been invited to join a company on boostbot.ai',
            html: formatEmail(company.name, insertData.id, appUrl),
        });
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const returnData: CompanyCreateInvitePostResponse = insertData;

    return res.status(httpCodes.OK).json(returnData);
};

export default handler;
