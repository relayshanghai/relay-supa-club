export const loginValidationErrors = {
    passwordNeedsTen: 'login.passwordNeedsTen',
    passwordNeedsNumber: 'login.passwordNeedsNumber',
    passwordNeedsSpecial: 'login.passwordNeedsSpecial',
    firstNameRequired: 'login.firstNameRequired',
    lastNameRequired: 'login.lastNameRequired',
    emailInvalid: 'login.emailInvalid',
    passwordsDoNotMatch: 'login.passwordsDoNotMatch',
    missingRequiredFields: 'login.missingRequiredFields',
};

export type InviteStatusError =
    | 'login.inviteInvalid'
    | 'login.inviteUsed'
    | 'login.inviteExpired'
    | 'login.inviteAlreadyExists';

export const inviteStatusErrors: { [key: string]: InviteStatusError } = {
    inviteInvalid: 'login.inviteInvalid',
    inviteUsed: 'login.inviteUsed',
    inviteExpired: 'login.inviteExpired',
    inviteAlreadyExists: 'login.inviteAlreadyExists',
};
