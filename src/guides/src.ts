type GuideStatus = 'saveState' | 'dontSaveState';
type GuidesListType = Record<string, GuideStatus>;

export const guidesList: GuidesListType = {
    'sequence#detail': 'saveState',
    'emailTemplate#modal': 'saveState',
    'boostbot#chat': 'saveState',
    'boostbot#influencerList': 'saveState',
    'boostbot#creatorReportModal': 'saveState',
    crm: 'saveState',
    'inbox#threads': 'saveState',
    'inbox#threadReply': 'saveState',
    account: 'saveState',
    crmV2: 'dontSaveState',
    productGuide: 'dontSaveState',
    productForm: 'dontSaveState',
    templateVariableModal: 'dontSaveState',
    templateLibraryModal: 'dontSaveState',
    templateLibraryWizardStep1: 'dontSaveState',
    templateLibraryWizardStep2: 'dontSaveState',
    campaignWizardStep1: 'dontSaveState',
    campaignWizardStep2: 'dontSaveState',
    campaignWizardStep3: 'dontSaveState',
};
