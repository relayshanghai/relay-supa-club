import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'What comes with the Discovery Plan?',
        children: (
            <>
                <ul>
                    <li>900 searches (roughly 9000 creator search results), </li>
                    <li>200 detailed reports each month*</li>
                </ul>
                <b>
                    *Reports are also consumed when adding a creator to your sequences, because we use that data to get
                    the creators contact info. 1 creator added to sequence = 1 report opened.
                </b>
            </>
        ),
    },
    {
        id: '2',
        title: 'What’s considered a search?',
        children: (
            <>
                <p>
                    Using the Classic search tool will consume 1 of the 900 search credits to unlock the first page of
                    results ( max 10).
                </p>

                <p>Unlocking the subsequent pages of results cost another 1 credit each.</p>

                <p>
                    BoostBot AI searches consume 5 credits no matter how many results are shown, but consume no
                    additional credits to view subsequent pages.
                </p>
            </>
        ),
    },
    {
        id: '3',
        title: 'Do I have access to the Outreach CRM tools?',
        children: (
            <>
                <p>
                    Yes, but you don’t have the ability to send out emails. In the CRM section, you can still create
                    “sequences” to group the creators you’ve selected in BoostBot AI Search or Classic Search.{' '}
                </p>

                <p>
                    The CRM “sequences” is where you can easily access the creator’s email address if the creator’s
                    detailed analysis report includes an email address. From here you can easily copy paste into your
                    own email system to email the influencers.{' '}
                </p>

                <p>You can upgrade to Outreach if if you’d like to experience full access to the CRM.</p>
            </>
        ),
    },
];
const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '探索套餐包括什么？',
        children: (
            <>
                <ul>
                    <li>每月最多900次搜索（约9000个KOL的搜索结果）</li>
                    <li>并解锁200份详细报告*</li>
                </ul>
                <b>
                    *将KOL加到序列时也会使用报告，因为我们使用该数据来获取KOL的联系信息。 1 个KOL添加到序列 = 1
                    个报告打开。
                </b>
            </>
        ),
    },
    {
        id: '2',
        title: '如何定义为一次搜索额度？',
        children: (
            <>
                <p>使用传统搜索，900个搜索额度中的1个将被用以解锁首页搜索结果（页面最多可包含10个搜索结果）。</p>

                <p>解锁后续的搜索结果页面，每一页需要使用1个搜索额度。</p>

                <p>
                    无论显示的搜索结果数量有多少，都需要使用5个搜索额度进行雷宝搜索，但将不需要使用额外额度查看后续页面。
                </p>
            </>
        ),
    },
    {
        id: '3',
        title: '我可以使用外联CRM工具吗？',
        children: (
            <>
                <p>
                    可以的，虽然在此方案您暂未解锁我们平台上收发电子邮件的功能，您仍可创建“CRM邮件管理进程的序列”将您在雷宝
                    AI搜索或传统搜索中所选择的KOL进行分组。
                </p>

                <p>
                    如果KOL的详细分析报告包含了他们电子邮件地址，您即可在此处轻松获得，并复制粘贴到您的电子邮件系统向网红发送电子邮件。
                </p>

                <p>如果您希望体验外联试用套餐中完整的CRM功能，可以随时升级套餐。</p>
            </>
        ),
    },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const DiscoverSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? 'Discovery Plan' : '探索方案'}</h1>
                <div className="w-1/2">
                    <h3>{locale === 'en' ? 'Find your next creator partner' : '找到您的下一个KOL合作伙伴'}</h3>
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

export default DiscoverSection;
