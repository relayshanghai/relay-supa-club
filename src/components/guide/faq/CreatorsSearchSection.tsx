import { Accordion } from 'shadcn/components/ui/accordion';
import { FAQAccordion, type FAQAccordionType } from './FAQAccordion';

const enQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: 'What kinds of search tools are available?',
        children: (
            <>
                <p>
                    BoostBot AI Search uses the power of AI to give you a curated list of great creators based on a
                    description you input into the chatbox. BoostBot AI Search is designed to get you started on your
                    influencer outreach journey within 5 minutes. All of BoostBot results include an email address for
                    the creator. But - it doesn’t give you a lot of control if you are looking for super specific
                    filters, for that we recommend going to Classic Search.
                </p>

                <p>
                    Classic Search gives you a lot more options when searching for your perfect list of creators to
                    reach out to, but is not as easy to use as BoostBot AI Search. With Classic Search you will be
                    finding creators based on platforms - so you can only search one platform (YouTube, TikTok,
                    Instagram) at a time. Select “add filters to tailor your results” for extra control on the type of
                    influencer you are looking for. Classic Search also allows you to search for a specific influencer.
                </p>
            </>
        ),
    },
];
const cnQuestions: FAQAccordionType[] = [
    {
        id: '1',
        title: '有哪些类型的搜索工具可用？',
        children: (
            <>
                <p>
                    雷宝BoostBot AI 搜索
                    运用人工智能的力量，将根据您在对话框中输入的描述，为您提供一份精心挑选的优秀KOL名单。雷宝人工智能搜索旨在5分钟内让您开启红人外联之旅。雷宝的所有搜索结果都包含KOL的电子邮件地址。但如果您需要使用非常细分的筛选条件进行搜索，我们则建议使用传统搜索。
                </p>

                <p>
                    传统搜索 能为您在寻找最合适的KOL并创建联系名单时提供更多选择。使用传统搜索，您将基于社媒平台寻找KOL
                    -
                    您将按平台（YouTube、TikTok、Instagram）依次进行搜索。选择“添加筛选项”，进一步细化您需要寻找的红人类型。传统搜索还能让您搜寻具体的某位红人。
                </p>
            </>
        ),
    },
];

const questions: { en: FAQAccordionType[]; cn: FAQAccordionType[] } = {
    en: enQuestions,
    cn: cnQuestions,
};

const CreatorSearchSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h1 className="text-3xl">{locale === 'en' ? 'Searching for Creators' : '搜索KOL'}</h1>
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

export default CreatorSearchSection;
