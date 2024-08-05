import axios from 'axios';
import { logger } from '../logger';
import qs from 'querystring';
export default class HcaptchaService {
    static service = new HcaptchaService();
    static getService = () => HcaptchaService.service;
    private client = axios.create({
        baseURL: 'https://api.hcaptcha.com',
    });
    private secret = process.env.HCAPTCHA_SECRET;
    async validate(token: string) {
        const response = await this.client.post(
            '/siteverify',
            qs.stringify({
                secret: this.secret,
                response: token,
            }),
            {
                headers: {
                    ['Content-Type']: 'application/x-www-form-urlencoded',
                },
            },
        );
        logger.info('hcaptcha response', { response: response.data, secret: this.secret, token });
        if (response?.data?.success) {
            return true;
        }
        return false;
    }
}
