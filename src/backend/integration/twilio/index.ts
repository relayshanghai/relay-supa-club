import type { Twilio } from 'twilio';
import twilio from 'twilio';

export default class TwilioService {
    static service = new TwilioService();
    static getService = () => TwilioService.service;
    client: Twilio;
    phoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';
    serviceId: string = process.env.TWILIO_VERIFY_SID || 'my-service';
    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    sendOtp(to: string) {
        return this.client.verify.v2.services(this.serviceId).verifications.create({
            to,
            channel: 'sms',
        });
    }

    async verifyOtp(to: string, code: string) {
        const response = await this.client.verify.v2.services(this.serviceId).verificationChecks.create({
            code,
            to,
        });
        if (response.status === 'approved') {
            return true;
        }
        return false;
    }
}
