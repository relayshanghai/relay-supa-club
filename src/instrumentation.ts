import { registerOTel } from '@vercel/otel';
import './utils/apm';
export function register() {
    registerOTel('next-app');
}
