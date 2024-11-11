import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'Do I need to add a payment method first?',
        children: <p>No need! You can signup and start using BoostBot just by verifying your phone number.</p>,
    },
    {
        id: '2',
        title: 'How long is the trial? And what are the limits?',
        children: (
            <ul>
                <li>The trial is 5 days</li>
                <li>Can do up to 200 searches (roughly 2000 creator search results) </li>
                <li>Can unlock 50 detailed reports. </li>
            </ul>
        ),
    },
    // {
    //     id: '3',
    //     title: 'Do I have access to the Outreach CRM tools?',
    //     children: (
    //         <>
    //             <p>
    //                 You don’t have the ability to send out emails. But you can still create “sequences” to group the
    //                 creators you’ve selected in BoostBot AI Search or Classic Search.
    //             </p>

    //             <p>
    //                 The CRM “sequences” is where you can easily access the creator’s email address if the creator’s
    //                 detailed analysis report includes an email address. From here you can easily copy paste into your
    //                 own email system to email the influencers.
    //             </p>

    //             <p>You can upgrade to access to the CRM with an Outreach plan trial.</p>
    //         </>
    //     ),
    // },
];
const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '我需要先添加付款方式吗？',
        children: <p>不需要！只需验证您的电话号码即可注册使用雷宝。</p>,
    },
    {
        id: '2',
        title: '免费试用期有多长？有什么限制吗？',
        children: (
            <ul>
                <li>试用期为5天</li>
                <li>可进行最多200次搜索（约2000个KOL的搜索结果）</li>
                <li>并解锁50份详细报告。</li>
            </ul>
        ),
    },
    // {
    //     id: '3',
    //     title: '我可以使用外联CRM工具吗？',
    //     children: (
    //         <>
    //             <p>
    //                 可以的，虽然此时在试用阶段您暂未解锁我们平台上收发电子邮件的功能，您仍可创建“邮件进程管理的序列”将您在雷宝
    //                 AI搜索或传统搜索中所选择的KOL进行分组。
    //             </p>

    //             <p>
    //                 如果网红的详细分析报告中包含了他们电子邮件地址，您即可在此处轻松获得，并复制粘贴到您的电子邮件系统向网红发送电子邮件。
    //             </p>

    //             <p>如果您希望体验外联试用套餐中完整的CRM功能，请与我们的销售团队联系。</p>
    //         </>
    //     ),
    // },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const FreeTrialSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? 'Free Trial' : '免费试用'}</h1>
                <div className="w-1/2">
                    <h3>{locale === 'en' ? 'Getting Started' : '开始前的准备'}</h3>
                </div>
                <div>
                    <Accordion type="multiple">
                        {questions[locale as keyof typeof questions].map((question) => (
                            <FAQAccordion key={question.id} {...question} />
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default FreeTrialSection;
