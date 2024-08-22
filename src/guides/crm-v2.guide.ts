import { type DriveStep } from 'driver.js';
import {
    crmGuideEn,
    templateVariableModalEn,
    templateLibraryModalEn,
    templateLibraryWizardStep1En,
    templateLibraryWizardStep2En,
    campaignWizardStep1En,
    campaignWizardStep2En,
    campaignWizardStep3En,
} from './en/crm-v2.guide';
import { type i18n } from 'i18next';
import { enUS } from 'src/constants';
import {
    crmGuideCn,
    templateVariableModalCn,
    templateLibraryModalCn,
    templateLibraryWizardStep1Cn,
    templateLibraryWizardStep2Cn,
    campaignWizardStep1Cn,
    campaignWizardStep2Cn,
    campaignWizardStep3Cn,
} from './cn/crm-v2.guide';

export const crmGuide = (i18n?: i18n): DriveStep[] => (i18n?.language === enUS ? crmGuideEn : crmGuideCn);

export const templateVariableModal = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? templateVariableModalEn : templateVariableModalCn;

export const templateLibraryModal = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? templateLibraryModalEn : templateLibraryModalCn;

export const templateLibraryWizardStep1 = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? templateLibraryWizardStep1En : templateLibraryWizardStep1Cn;

export const templateLibraryWizardStep2 = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? templateLibraryWizardStep2En : templateLibraryWizardStep2Cn;

export const campaignWizardStep1 = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? campaignWizardStep1En : campaignWizardStep1Cn;

export const campaignWizardStep2 = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? campaignWizardStep2En : campaignWizardStep2Cn;

export const campaignWizardStep3 = (i18n?: i18n): DriveStep[] =>
    i18n?.language === enUS ? campaignWizardStep3En : campaignWizardStep3Cn;
