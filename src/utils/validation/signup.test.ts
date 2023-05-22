import { describe, it, expect } from 'vitest';
import { validatePassword, validateSignupInput } from './signup';
import { loginValidationErrors } from '../../errors/login';

describe('validatePassword', () => {
    it('returns the correct error message if password contains spaces', () => {
        const password = 'password with spaces';
        const result = validatePassword(password);
        expect(result).toEqual(loginValidationErrors.noSpacesAllowed);
    });
    it('returns the correct error if password is less than 10 characters', () => {
        const password = '123456789';
        const result = validatePassword(password);
        expect(result).toEqual(loginValidationErrors.passwordNeedsTen);
    });
    it('returns the correct error if password has no number', () => {
        const password = '!asdfasdfasdfasdf';
        const result = validatePassword(password);
        expect(result).toEqual(loginValidationErrors.passwordNeedsNumber);
    });
    it('returns the correct error if password has no special characters', () => {
        const password = '123asdf123asdf';
        const result = validatePassword(password);
        expect(result).toEqual(loginValidationErrors.passwordNeedsSpecial);
    });
    it('accepts valid password and returns null', () => {
        const password = 'asdfasdf123!';
        const result = validatePassword(password);
        expect(result).toBe(null);
    });
});

describe('validateSignupInput', () => {
    it('requires a first and last name and returns the proper error', () => {
        const firstName = '';
        const result = validateSignupInput('firstName', firstName, '');
        expect(result).toEqual(loginValidationErrors.firstNameRequired);
        // accepts valid

        expect(validateSignupInput('firstName', 'Bob', '')).toBeNull();

        const lastName = '';
        const result2 = validateSignupInput('lastName', lastName, '');
        expect(result2).toEqual(loginValidationErrors.lastNameRequired);
        expect(validateSignupInput('lastName', 'Dole', '')).toBeNull();
    });
    it('returns the correct error if email is invalid', () => {
        const email = 'not-an-email';
        const result = validateSignupInput('email', email, '');
        expect(result).toEqual(loginValidationErrors.emailInvalid);

        expect(validateSignupInput('email', 'me@example.com', '')).toBeNull();
    });
    it('returns the correct error if phoneNumber is invalid', () => {
        const number = '123-oops-123';
        const result = validateSignupInput('phoneNumber', number, '');
        expect(result).toEqual(loginValidationErrors.phoneNumberInvalid);

        expect(validateSignupInput('phoneNumber', '412-1231-123', '')).toBeNull();
    });
    it('compares passwords', () => {
        const password = '123asdf123asdf!';
        const passwordConfirm = 'fasdfasdf123!';
        const result = validateSignupInput('confirmPassword', passwordConfirm, password);
        expect(result).toEqual(loginValidationErrors.passwordsDoNotMatch);

        expect(validateSignupInput('confirmPassword', 'asdf123asdf!', 'asdf123asdf!')).toBeNull();
    });
});
