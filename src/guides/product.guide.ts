import { type DriveStep } from 'driver.js';
import { productFormEn, productGuideEn } from './en/product.guide';
import { type i18n } from 'i18next';
import { productFormCn, productGuideCn } from './cn/product.guide';
import { enUS } from 'src/constants';

export const productGuide = (i18n?: i18n): DriveStep[] => (i18n?.language === enUS ? productGuideEn : productGuideCn);
export const productForm = (i18n?: i18n): DriveStep[] => (i18n?.language === enUS ? productFormEn : productFormCn);
