import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'What comes with the Outreach Plan?',
        children: (
            <>
                <ul>
                    <li>1,200 searches (roughly 12,000 creator search results),</li>
                    <li>600 detailed reports each month*</li>
                </ul>
                <b>
                    *Reports are also consumed when adding a creator to your sequences, because we use that data to get
                    the creators contact info & info for automated templates. 1 creator added to sequence = 1 report
                    opened.
                </b>
            </>
        ),
    },
    {
        id: '2',
        title: 'How many creators can I contact?',
        children: (
            <>
                <p>
                    You can send up to 30 initial emails per day, and we will schedule follow-ups for the creators that
                    don’t reply. When the 1st follow-up and 2nd follow-up emails are sending out, you can send up to a
                    total of 90 emails per day.{' '}
                </p>

                <p>
                    This will let you contact a total of 600 creators each month. (See examples of the sending cadence,
                    and campaign ramp-up on the following slides)
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
                    Yes, you have full access to the Outreach CRM including the Automated Sequences and Integrated
                    Inbox.
                </p>
            </>
        ),
    },
    {
        id: '4',
        title: 'Can I use my own templates?',
        children: (
            <>
                <p>
                    Currently we only allow for one pre-made template which allows you to include information about your
                    product. We are working on allowing BoostBot users to create your own templates in the future
                    though!
                </p>
            </>
        ),
    },
    {
        id: '5',
        title: 'Can I cc someone or include an attachment? ',
        children: (
            <>
                <p>
                    For the initial outreach, we unfortunately do not support cc or attachments. However, after the
                    influencer has responded to you, you can cc others and include attachments up to 25mb.
                </p>
            </>
        ),
    },
];

const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '拓展套餐包括什么？',
        children: (
            <>
                <ul>
                    <li>每月最多1200次搜索（约12000个KOL的搜索结果）</li>
                    <li>并解锁600份详细报告*</li>
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
        title: '我可以联系多少位KOL呢？',
        children: (
            <>
                <p>
                    您每天最多可发送30封的初始电子邮件，我们将为您向没有回复的网红安排发送跟进邮件。当第一封和第二封跟进邮件发出后，您每天可发送的邮件总数为90封。
                </p>

                <p>这将使您每月能联系总共600名KOL。（请参阅下页展示的邮件发送频次和推广活动增速示例）</p>
            </>
        ),
    },
    {
        id: '3',
        title: '我可以使用CRM工具吗？',
        children: (
            <>
                <p>是的，您能使用外联CRM的全部功能，包括自动化序列入式邮箱系统，及即将推出的个性化邮件模板功能。</p>
            </>
        ),
    },
    {
        id: '4',
        title: '我可以使用自己的邮件模板吗？',
        children: (
            <>
                <p>
                    目前，我们的邮件系统可以使用一个预制的，包含您产品相关信息的邮件模板。但我们正致力于让雷宝用户在不久的将来可以自主创建属于自己的邮件模板！
                </p>
            </>
        ),
    },
    {
        id: '5',
        title: '我可以在发送邮件时添加抄送人员或附件吗？ ',
        children: (
            <>
                <p>
                    我们的邮箱系统暂不支持在初始外联邮件中添加抄送人员或附件。当红人回复您之后，您便可以抄送其他人，并附上最大为25mb的附件。
                </p>
            </>
        ),
    },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const OutreachSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? 'Outreach Plan' : '拓展方案'}</h1>
                <div className="w-1/2">
                    <h3>{locale === 'en' ? 'Automated tools to run your campaigns' : '拓展方案'}</h3>
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

export default OutreachSection;
