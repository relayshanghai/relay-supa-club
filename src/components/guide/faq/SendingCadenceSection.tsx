import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';
import { TimelineItem } from 'src/components/ui/timeline-item';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'When do the emails actually get sent?',
        children: (
            <>
                <p>All emails are scheduled to be sent from Monday - Friday between 9am - 5pm U.S. CST.</p>
            </>
        ),
    },
];

const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '具体在什么时间发送电子邮件？',
        children: (
            <>
                <p>所有的电子邮件会被安排在周一至周五，CST(美国芝加哥）时间上午9点至下午5点间发送。</p>
            </>
        ),
    },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const enTimelineItems = [
    {
        title: 'Initial Outreach',
        content: 'Sent on next business day with an open slot',
    },
    {
        title: 'First Follow-up',
        content: "Sent 3 business days after initial outreach if you haven't received a response",
    },
    {
        title: 'Final Follow-up',
        content: "Sent 3 business days after first follow-up if you haven't received a response",
    },
];
const cnTimelineItems = [
    {
        title: '初始外联邮件',
        content: '在有空档的下一个工作日发送',
    },
    {
        title: '第一封跟进邮件',
        content: '若未收到回复，则将在初始外联邮件发送后的3个工作日后发送',
    },
    {
        title: '最后跟进邮件',
        content: '若再未收到回复，则将在第一封跟进邮件发送后的3个工作日后发送',
    },
];

const timelineItems = {
    en: enTimelineItems,
    cn: cnTimelineItems,
};

const SendingCadenceSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? 'Sending Cadence' : '邮件序列的发送频次'}</h1>
                <div className="w-1/2">
                    <h3>{locale === 'en' ? '' : ''}</h3>
                </div>
                <div>
                    <div className="relative my-6 flex w-full items-start justify-between">
                        <hr className="absolute left-1/2 top-0 w-[67%] -translate-x-1/2 -translate-y-1/2 transform border-2 border-blue-500" />
                        {timelineItems[locale as keyof typeof timelineItems].map((item, index) => (
                            <TimelineItem key={index} title={item.title} content={item.content} />
                        ))}
                    </div>
                    <div>
                        <img className="mb-4" src={`/assets/imgs/faqs/outreach-schedule-${locale}.png`} alt="" />
                    </div>
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

export default SendingCadenceSection;
