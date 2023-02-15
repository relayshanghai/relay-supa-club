import { emailRegex } from 'src/constants';
import { loginValidationErrors } from 'src/errors/login';

/**
 * Checks if password:
 * - is at least 10 characters long
 * - contains at least one number
 * - contains at least one special character
 * @returns null if password is valid, otherwise returns error message
 */
export const validatePassword = (password: string) => {
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
export type SignupInputTypes = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword';

export const validateSignupInput = (type: SignupInputTypes, value: string, password: string) => {
    switch (type) {
        case 'firstName':
            return !value ? loginValidationErrors.firstNameRequired : null;
        case 'lastName':
            return !value ? loginValidationErrors.lastNameRequired : null;
        case 'email':
            return !emailRegex.test(value) ? loginValidationErrors.emailInvalid : null;
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            return value !== password ? loginValidationErrors.passwordsDoNotMatch : null;
        default:
            return null;
    }
};
