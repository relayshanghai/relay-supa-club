import { emailRegex } from 'src/constants';
import { loginValidationErrors } from 'src/errors/login';

/**
 * Checks if password:
 * - is at least 10 characters long
 * - contains at least one number
 * - contains at least one special character
 * - cannot contain spaces
 * @returns null if password is valid, otherwise returns error message
 */
export const validatePassword = (password: string) => {
    if (password.includes(' ')) {
        return loginValidationErrors.noSpacesAllowed;
    }
    if (password.length < 10) {
        return loginValidationErrors.passwordNeedsTen;
    }
    const numberRegex = /\d/;
    if (!numberRegex.test(password)) {
        return loginValidationErrors.passwordNeedsNumber;
    }
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(password)) {
        return loginValidationErrors.passwordNeedsSpecial;
    }

    return null;
};
export type LegacySignupInputTypes =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'phoneNumber';

export const validateLegacySignupInput = (type: SignupInputTypes, value: string, password: string) => {
    switch (type) {
        case 'firstName':
            return !value ? loginValidationErrors.firstNameRequired : null;
        case 'lastName':
            return !value ? loginValidationErrors.lastNameRequired : null;
        case 'email':
            // TODO: use library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            if (value.includes(' ')) {
                return loginValidationErrors.noSpacesAllowed;
            }
            return !emailRegex.test(value) ? loginValidationErrors.emailInvalid : null;
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            return value !== password ? loginValidationErrors.passwordsDoNotMatch : null;
        case 'phoneNumber':
            if (value.includes(' ')) {
                return loginValidationErrors.noSpacesAllowed;
            }
            // TODO: use library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            const onlyNumbersDashesPLusSignParensRegex = /^[\d\-\+\(\)]+$/;
            return !onlyNumbersDashesPLusSignParensRegex.test(value) ? loginValidationErrors.phoneNumberInvalid : null;
        default:
            return null;
    }
};

export type SignupInputTypes =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'phoneNumber'
    | 'companyName'
    | 'companyWebsite'
    | 'currency';

export const validateSignupInput = (type: SignupInputTypes, value: string, password: string) => {
    switch (type) {
        case 'firstName':
            return !value ? loginValidationErrors.firstNameRequired : null;
        case 'lastName':
            return !value ? loginValidationErrors.lastNameRequired : null;
        case 'email':
            // TODO: use library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            if (value.includes(' ')) {
                return loginValidationErrors.noSpacesAllowed;
            }
            return !emailRegex.test(value) ? loginValidationErrors.emailInvalid : null;
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            return value !== password ? loginValidationErrors.passwordsDoNotMatch : null;
        case 'phoneNumber':
            if (value.includes(' ')) {
                return loginValidationErrors.noSpacesAllowed;
            }
            // TODO: use library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            const onlyNumbersDashesPLusSignParensRegex = /^[\d\-\+\(\)]+$/;
            return !onlyNumbersDashesPLusSignParensRegex.test(value) ? loginValidationErrors.phoneNumberInvalid : null;
        case 'companyName':
            return !value ? loginValidationErrors.companyNameRequired : null;
        default:
            return null;
    }
};
