import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'What is a warmed domain?',
        children: (
            <>
                <p>
                    Warming up a domain for cold outreach is a slow but crucial process for your campaign’s success. It
                    takes 8 weeks of sending emails that are opened and replied to by the recipient to build up a
                    reputation with email providers.{' '}
                </p>
                <p>
                    Those providers, like Gmail and Outlook, use this reputation to decide whether your emails make it
                    to the inbox, or get sent to spam. {"We've"}
                    done all that already, so you can get started sending outreach emails immediately.
                </p>
            </>
        ),
    },
    {
        id: '2',
        title: 'Can I just use my own email?',
        children: (
            <>
                <p>
                    No. To ensure that your emails are not ending up in spam/junk to give you the best possibility of
                    the creator opening up your email, and to protect your main domain reputation we use our own
                    pre-warmed Outreach domains
                </p>
            </>
        ),
    },
    {
        id: '3',
        title: 'Won’t that be confusing for creators?',
        children: (
            <>
                <p>
                    No need to worry! Your emails will show as coming from you. We set the account name for you and the
                    actual email address is not shown in inboxes anymore, only the account name. So, for example in
                    their inbox, the creator will see:
                </p>
                <p>Phil from Nike, Steve at Apple, or Sam at OpenAI</p>
                <p>(With your name and company of course)</p>
                <p>And we will set up your email using one of three options:</p>
                <ul>
                    <li>name_brand@creatorlove.boostbot.ai</li>
                    <li>brand@creatorlove.boostbot.ai</li>
                    <li>name@creatorlove.boostbot.ai</li>
                </ul>
            </>
        ),
    },
];

const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '什么是预热过的域名？',
        children: (
            <>
                <p>
                    为冷外联预热一个域名，对于您能否成功开展推广活动来说，虽是一个缓慢但却是至关重要的过程。这个过程为期8周，在这期间发出的邮件需要被收件人打开并回复，邮箱域名才能在电子邮件服务商那建立良好的声誉。
                </p>
                <p>
                    像Gmail和Outlook等的电子邮件服务商，将视域名的声誉来决定电子邮件是否进入收件人的收件箱，还是垃圾箱。我们提前为您做好了这些前期准备，让您可以立即发送外联邮件。
                </p>
            </>
        ),
    },
    {
        id: '2',
        title: '我可以用我自己的电子邮箱吗？',
        children: (
            <>
                <p>
                    很抱歉不可以。为了让您的电子邮件不会被发送到垃圾箱，确保网红打开您邮件的最大可能性，以及保护您主域名的声誉，我们将使用已预热过的外联邮箱域名。
                </p>
            </>
        ),
    },
    {
        id: '3',
        title: '这难道不会让KOL分不清发件人吗？',
        children: (
            <>
                <p>
                    无需担心！所发出的电子邮件仍能从名称上看出是来自于您的。我们将为您设置帐户名，收件箱中将不再显示具体的电子邮件地址而只显示帐户名。因此，网红看到的发件人将显示为例如：
                </p>
                <p>耐克的菲尔，苹果的史蒂夫，或OpenAI的山姆。</p>
                <p>（当然我们将用您的名字和公司名来设置帐户名。）</p>
                <p>您可以从以下三个排列组合中选择一个用于设置您的电子邮箱帐户：</p>
                <ul>
                    <li>name_brand@creatorlove.boostbot.ai</li>
                    <li>brand@creatorlove.boostbot.ai</li>
                    <li>name@creatorlove.boostbot.ai</li>
                </ul>
            </>
        ),
    },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const WarmSendingDomainSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? '‘Warm’ Sending Domains' : '“热”的邮箱域名'}</h1>
                <div className="w-1/2">
                    <h3>{locale === 'en' ? '' : ''}</h3>
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

export default WarmSendingDomainSection;
