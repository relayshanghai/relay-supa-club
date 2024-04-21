import type { RegisterRequest } from 'pages/api/users/request';
import type { DeleteTeammateRequest, UpdateTeammateRoleRequest } from 'pages/api/v2/company/request';
import { CompanyEntity } from 'src/backend/database/company/company-entity';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import TwilioService from 'src/backend/integration/twilio';
import { createCompanyErrors } from 'src/errors/company';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { createContact } from 'src/utils/api/brevo';
import { DISCOVERY_PLAN } from 'src/utils/api/stripe/constants';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import awaitToError from 'src/utils/await-to-error';
import { BadRequestError, ConflictError, NotFoundError } from 'src/utils/error/http-error';
import { serverLogger } from 'src/utils/logger-server';
import { RequestContext } from 'src/utils/request-context/request-context';
import { supabase } from 'src/utils/supabase-client';
import { unixEpochToISOString, isAdmin } from 'src/utils/utils';
import { v4 } from 'uuid';
import SequenceService from '../sequence/sequence-service';
import type { AccountRole } from 'types';
import { UsageRepository } from 'src/backend/database/usages/repository';
import RecaptchaService from 'src/backend/integration/recaptcha/recaptcha-service';
/** Brevo List ID of the newly signed up trial users that will be funneled to an marketing automation */
const BREVO_NEWTRIALUSERS_LIST_ID = process.env.BREVO_NEWTRIALUSERS_LIST_ID ?? null;

export default class RegistrationService {
    static service = new RegistrationService();
    static getService = () => RegistrationService.service;
    async isPhoneNumberDoesNotExist(phoneNumber: string) {
        const isPhoneNumberExists = await ProfileRepository.getRepository().phoneNumberExists(phoneNumber);
        if (isPhoneNumberExists) throw new ConflictError(RequestContext.t('signup.phoneNumberAlreadyInUse'));
    }
    async isEmailDoesNotExist(email: string) {
        const isEmailExists = await ProfileRepository.getRepository().emailExists(email);
        if (isEmailExists) throw new ConflictError('Email already exists');
    }
    async isCompanyDoesNotExists(name: string) {
        const [err] = await awaitToError(CompanyRepository.getRepository().getCompanyByName(name));
        if (err && err instanceof NotFoundError) {
            return true;
        }
        throw new ConflictError(createCompanyErrors.companyWithSameNameExists);
    }
    async updateProfileRole(request: UpdateTeammateRoleRequest) {
        const adminProfile = await ProfileRepository.getRepository().getProfileById(request.adminId);
        const teammateProfile = await ProfileRepository.getRepository().getProfileById(request.teammateId);
        if (!adminProfile || !teammateProfile) {
            throw new NotFoundError('Profile not found');
        }
        if (!isAdmin(adminProfile.userRole as AccountRole)) {
            throw new BadRequestError('Only Admins can change user roles');
        }
        await ProfileRepository.getRepository().update(
            {
                id: request.teammateId,
            },
            {
                userRole: request.role,
            },
        );
        return teammateProfile;
    }

    async sendOtp(phoneNumber: string, recaptchaToken: string) {
        const success = await RecaptchaService.getService().validate(recaptchaToken);
        if (!success) {
            throw new BadRequestError(RequestContext.t('signup.recaptchaError'));
        }
        await TwilioService.getService().sendOtp(phoneNumber);
    }
    async createStripeCustomerAndSubscription(param: RegisterRequest & { companyId: string }) {
        const { companyName, companyId, email, rewardfulReferral } = param;
        const customer = await stripeClient.customers.create({
            name: companyName,
            email,
            metadata: {
                company_id: companyId,
                referral: rewardfulReferral || null,
            },
        });

        if (!customer || !customer.id) {
            throw new Error(createCompanyErrors.unableToMakeStripeCustomer);
        }

        const { trial_days, priceId } = DISCOVERY_PLAN;

        const subscription = await stripeClient.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            proration_behavior: 'create_prorations',
            trial_period_days: Number(trial_days),
            trial_settings: {
                end_behavior: {
                    missing_payment_method: 'pause',
                },
            },
        });

        if (!subscription || subscription.status !== 'trialing') {
            throw new Error(createSubscriptionErrors.unableToActivateSubscription);
        }

        return { cusId: customer.id, subscription };
    }

    async createCompany(request: RegisterRequest) {
        const companyId = v4();
        const { cusId, subscription } = await this.createStripeCustomerAndSubscription({
            ...request,
            companyId,
        });
        const { searches, profiles, trial_searches: trialSearches, trial_profiles: trialProfiles } = DISCOVERY_PLAN;

        const company = new CompanyEntity();
        company.id = companyId;
        company.name = request.companyName;
        company.website = request.companyWebsite;
        company.cusId = cusId;
        company.termsAccepted = true;
        company.profilesLimit = profiles;
        company.searchesLimit = searches;
        company.trialProfilesLimit = trialProfiles;
        company.trialSearchesLimit = trialSearches;
        company.subscriptionStatus = 'trial';
        const subscriptionStartDate = unixEpochToISOString(subscription.trial_start, subscription.start_date);
        if (subscriptionStartDate) {
            company.subscriptionStartDate = new Date(subscriptionStartDate);
        }
        const subscriptionCurrentPeriodStart = unixEpochToISOString(subscription.current_period_start);
        if (subscriptionCurrentPeriodStart) {
            company.subscriptionCurrentPeriodStart = new Date(subscriptionCurrentPeriodStart);
        }
        const subscriptionCurrentPeriodEnd = unixEpochToISOString(subscription.current_period_end);
        if (subscriptionCurrentPeriodEnd) {
            company.subscriptionCurrentPeriodEnd = new Date(subscriptionCurrentPeriodEnd);
        }
        company.subscriptionPlan = 'Discovery';

        const createdCompany = await CompanyRepository.getRepository().save(company);
        return createdCompany;
    }
    async createBrevoContact(profile: ProfileEntity, company: CompanyEntity) {
        if (!profile.email || !company.name || !BREVO_NEWTRIALUSERS_LIST_ID) {
            return false;
        }
        const [err] = await awaitToError(
            createContact({
                email: profile.email,
                attributes: {
                    FIRSTNAME: profile.firstName,
                    LASTNAME: profile.lastName,
                    COMPANYNAME: company.name,
                },
                listIds: [Number(BREVO_NEWTRIALUSERS_LIST_ID)],
            }),
        );
        if (err) {
            serverLogger(err, (scope) => {
                return scope.setContext('Error', {
                    error: 'Cannot create brevo contact',
                    email: profile.email,
                    listId: BREVO_NEWTRIALUSERS_LIST_ID,
                });
            });
        }
    }
    async createProfile(request: RegisterRequest, company: CompanyEntity) {
        const profile = new ProfileEntity();
        profile.company = company;
        profile.firstName = request.firstName;
        profile.lastName = request.lastName;
        profile.email = request.email;
        profile.phone = request.phoneNumber;
        profile.userRole = 'company_owner';
        const supportProfile = Object.assign(new ProfileEntity(), profile);
        const supportPassword = process.env.SERVICE_ACCOUNT_PASSWORD ?? 'password123!';
        supportProfile.phone = undefined;
        supportProfile.email = `support+${company.cusId?.toLowerCase().trim()}@boostbot.ai`;
        supportProfile.userRole = 'company_owner';
        const [user, supportUser] = await Promise.all([
            supabase.auth.admin.createUser({
                email: request.email,
                password: request.password,
                phone_confirm: true,
                email_confirm: true,
            }),
            supabase.auth.admin.createUser({
                email: supportProfile.email,
                password: supportPassword,
                phone_confirm: true,
                email_confirm: true,
            }),
        ]);
        if (!user.data?.user || !supportUser.data?.user) {
            throw new BadRequestError('User already registered');
        }
        profile.id = user.data?.user.id;
        supportProfile.id = supportUser.data?.user.id;
        const [createdProfile] = await Promise.all([
            ProfileRepository.getRepository().save(profile),
            ProfileRepository.getRepository().save(supportProfile),
        ]);
        return createdProfile;
    }
    async verifyOtp(phoneNumber: string, code: string) {
        const isVerified = await TwilioService.getService().verifyOtp(phoneNumber, code);
        if (!isVerified) throw new BadRequestError(RequestContext.t('signup.invalidOtp'));
        return true;
    }
    @UseTransaction()
    async register(request: RegisterRequest) {
        const createdCompany = await this.createCompany(request);
        const createdProfile = await this.createProfile(request, createdCompany);
        await this.createBrevoContact(createdProfile, createdCompany);
        return createdCompany;
    }

    async deleteProfile(request: DeleteTeammateRequest) {
        const adminProfile = await ProfileRepository.getRepository().getProfileById(request.adminId);
        const teammateProfile = await ProfileRepository.getRepository().getProfileById(request.teammateId);
        if (isAdmin(teammateProfile.userRole as AccountRole)) {
            throw new BadRequestError('Cannot delete admin');
        }
        await SequenceService.getService().moveManager(adminProfile, teammateProfile);
        if (!adminProfile || !teammateProfile) {
            throw new NotFoundError('Profile not found');
        }
        await supabase.auth.admin.deleteUser(teammateProfile.id);
        await UsageRepository.getRepository().deleteUsagesByProfile(teammateProfile.id);
        const deletedUser = await ProfileRepository.getRepository().deleteProfileById(teammateProfile.id);
        return deletedUser;
    }
}
