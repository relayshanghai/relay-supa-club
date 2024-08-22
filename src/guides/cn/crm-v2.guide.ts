import { type DriveStep } from 'driver.js';

export const crmGuideCn: DriveStep[] = [
    {
        element: '#v2-crm-page',
        popover: {
            title: '欢迎访问我们全新的CRM页面！',
            description: `欢迎来到全新优化的序列管理页面！我们以更直观的布局，重新设计了该页面，使您可以更轻松地浏览序列和电子邮件模板。您将享受到更高的可视性、更流畅的切换以及更简洁的设计，从而改善您的整体体验。进入并探索升级后的界面！`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-button',
        popover: {
            title: '管理邮件模版变量',
            description: `管理邮件模板中的变量。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#template-library-button',
        popover: {
            title: '创建您自己的邮件模版',
            description: `在这里管理您的邮件模版`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#create-campaign-button',
        popover: {
            title: '创建新的项目',
            description: `邮件模板准备就绪后，就可以开始创建您的项目！`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#banner-button',
        popover: {
            title: '创建新的序列',
            description: `目前，您仍然可以使用旧版本的序列管理，只需点击按钮，整个CRM界面就会切换回旧版的视图！`,
            side: 'left',
            align: 'start',
        },
    },
];

export const templateVariableModalCn: DriveStep[] = [
    {
        element: '#template-variable-modal',
        popover: {
            title: '创建新的变量',
            description: `创建新的变量，用于向红人发送电子邮件。选择创建邮件模板时使用的变量。`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-category-input',
        popover: {
            title: '选择变量类别',
            description: `这些是变量的可用类别。`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#template-variable-name-input',
        popover: {
            title: '为您的变量命名',
            description: `为变量命名，但请确保名称中，只包含字母或数字！`,
            side: 'top',
            align: 'start',
        },
    },
];

export const templateLibraryModalCn: DriveStep[] = [
    {
        element: '#start-new-email-template',
        popover: {
            title: '创建新的邮件模版',
            description: `使用该按钮开始创建邮件模板。`,
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#list-created-email-template',
        popover: {
            title: '已创建的模板列表',
            description: `查看根据每个步骤创建的邮件模板列表。`,
            side: 'top',
            align: 'start',
        },
    },
];

export const templateLibraryWizardStep1Cn: DriveStep[] = [
    {
        element: '#step1-template-wizard',
        popover: {
            title: '电子邮件模板向导',
            description: `该向导将指导您创建邮件模板。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#variable-list-template-wizard',
        popover: {
            title: '已创建变量列表',
            description: `这里将显示您创建的变量！`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-step-options',
        popover: {
            title: '步骤选择',
            description: `C选择您希望在哪个步骤/阶段发送此邮件模板。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-step-subject',
        popover: {
            title: '设置电子邮件主题',
            description: `键入电子邮件主题。您还可以点击左侧的变量，在此处添加变量。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-content',
        popover: {
            title: '创建邮件模板内容',
            description: `输入你想输入的任何语言。点击左侧的变量，即可将变量添加到编辑器中。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#email-template-finish-button',
        popover: {
            title: '完成创建邮件模板',
            description: `如果您认为邮件模版已经完成，继续下一步，请点击这里。`,
            side: 'left',
            align: 'start',
        },
    },
];

export const templateLibraryWizardStep2Cn: DriveStep[] = [
    {
        element: '#step2-template-wizard',
        popover: {
            title: '为您的邮件模版命名',
            description: `为您当前的邮件模版命名以及添加描述`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step2-finish-button',
        popover: {
            title: '保存您的邮件模版',
            description: `完成后，单击此按钮保存模板。`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep1Cn: DriveStep[] = [
    {
        element: '#step1-campaign-wizard',
        popover: {
            title: '创建一个新的项目',
            description: `该向导将指导您如何使用创建的邮件模板，为红人创建项目的邮件序列！`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step1-next-button',
        popover: {
            title: '选择邮件模版',
            description: `- 您将看到按序列步骤/阶段分组的，已创建的邮件模板列表。单击并开始创建新序列。一个邮件序列包含三个步骤，因此必须在每个步骤中添加一个新的邮件模板才能继续下一步。`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep2Cn: DriveStep[] = [
    {
        element: '#step2-campaign-wizard',
        popover: {
            title: '创建一个新的项目',
            description: `为您的项目序列命名，以及选择您的产品！`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step2-next-button',
        popover: {
            title: '选择邮件模版',
            description: `当您准备好下一步时，请单击此处。`,
            side: 'left',
            align: 'start',
        },
    },
];

export const campaignWizardStep3Cn: DriveStep[] = [
    {
        element: '#step3-campaign-wizard',
        popover: {
            title: '为变量赋值',
            description: `在此配置变量。在将邮件发送给红人时，您输入的每一个信息都将替代变量`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step3-steps-tab',
        popover: {
            title: '适用于所有步骤的变量',
            description: `这些变量将适用于邮件序列中的所有步骤/阶段。`,
            side: 'left',
            align: 'start',
        },
    },
    {
        element: '#step3-next-button',
        popover: {
            title: '完成创建活动',
            description: `完成变量值配置后，请单击此处。`,
            side: 'left',
            align: 'start',
        },
    },
];
