import { InviteStatusError } from './login';

export const acceptInviteErrors: { [key: string]: InviteStatusError } = {
    inviteInvalid: 'login.inviteInvalid',
    userAlreadyRegistered: 'login.userAlreadyRegistered',
};
export const createInviteErrors = {
    inviteAlreadyExists: 'inviteAlreadyExists',
    invalidEmail: 'invalidEmail',
    missingRequiredFields: 'missingRequiredFields',
    userAlreadyExists: 'userAlreadyExists',
    inviteExistsAndHasNotExpired: 'inviteExistsAndHasNotExpired',
};
export const createCompanyValidationErrors = {
    noLoggedInUserFound: 'noLoggedInUserFound',
    noCompanyNameFound: 'noCompanyNameFound',
};
export const createCompanyErrors = {
    companyWithSameNameExists: 'companyWithSameNameExists',
};
export const updateCompanyErrors = {
    companyWithSameNameExists: 'companyWithSameNameExists',
};
export const createEmployeeError = {
    isNotEmployee: 'isNotEmployee',
};
