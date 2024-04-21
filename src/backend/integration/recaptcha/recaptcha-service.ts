import axios from 'axios';
import { logger } from '../logger';
export default class RecaptchaService {
    static service = new RecaptchaService();
    static getService = () => RecaptchaService.service;
    private client = axios.create({
        baseURL: 'https://www.google.com/recaptcha',
    });
    private secret = process.env.RECAPTCHA_SECRET_KEY;
    async validate(token: string) {
        const response = await this.client.post('/api/siteverify', {
            secret: this.secret,
            response: token,
        });
        logger.info('recaptcha response', { response: response.data, secret: this.secret, token });
        if (response?.data?.success) {
            return true;
        }
        return false;
    }
}
