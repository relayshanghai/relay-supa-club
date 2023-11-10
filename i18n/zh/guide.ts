const guidePage = {
    welcome: '欢迎来到',
    welcomeDescription: '需要帮助吗？请查看以下主题，了解有关我们平台的更多信息！',
    goBack: '返回指南',
    goto: '前往',
    learnMore: '了解更多',
    cards: {
        boostbot: {
            title: 'BoostBot 雷宝',
            description:
                '不要再花费大量时间在寻找合适的红人上了。有了boostbot.ai的BoostBot AI技术，只需几分钟，即可开启红人联系工作，和红人商谈品牌合作和产品测评！',
        },
        sequences: {
            title: '邮件进程管理',
            description:
                '邮件进程管理是一系列自动化的电子邮件模板，我们会安排、发送和跟踪这些模板，使您联系KOL的工作更加自动化，每周节省数小时的人工工作。',
        },
        templates: {
            title: '模版',
            description:
                '电子邮件，很神奇！我们会从KOL的档案和您在“邮件进程管理项目“中设置的变量中提取信息，在发送前定制每封序列邮件。就像我们说的，神奇！',
        },
        inbox: {
            title: '收件箱',
            description: '无需再在电子邮件窗口和 boostbot.ai 之间切换。',
        },
        influencerProfile: {
            title: 'KOL 档案',
            description: '追踪所有合作数据，抛弃电子表格！KOL档案是一款专门用于管理和简化合作流程的工具。',
        },
        influencerManager: {
            title: 'KOL管理跟进',
            description: '鸟瞰您正在进行中的合作，绝不让任何KOL从缝隙中溜走。',
        },
        discover: {
            title: '发现KOL',
            description:
                '我们的数据库涵盖了3个平台共计超过2.75亿个的红人帐户，并提供数据驱动工具助您找到完美的网红达人。',
        },
        account: {
            title: '监控您的使用情况',
            description: '查看谁有您管理项目的访问权，以及您打开了多少位网红达人的档案。',
        },
    },
    modalInfo: {
        boostbot: {
            title: 'BoostBot 雷宝',
            url: '/boostbot',
            sections: [
                {
                    title: '雷宝是如何运作的',
                    description:
                        'BoostBot 是一款AI辅助的搜索工具，它能找到海外社交媒体可以推广产品的优秀红人，您只需描述产品（任何语言均可），它便会分析相关搜索主题，并从2亿多的红人数据库中找到合适的红人。不仅如此，它可以根据粉丝数、互动率、地区等指标优化搜索结果。最终，BoostBot向您呈现的是一份带有联系方式的庞大的红人名单，您可以立即与名单上的红人开展品牌合作或营销推广。',
                    demo: 'boostbot_demo.gif',
                },
            ],
        },
        sequences: {
            title: '邮件进程管理',
            url: '/sequences',
            sections: [
                {
                    title: '邮件进程管理是什么？',
                    description:
                        '“邮件进程管理”功能就像一个邮件模板播放列表，它可以被定制、安排并自动向您从“探索方案”或BoostBot人工智能搜索中添加的KOL发送邮件。因此，您可以将“邮件进程管理”功能视为一组预先制定好的电子邮件，也可以将其视为您已添加的KOL群组。',
                },
                {
                    title: '',
                    description:
                        '每个“邮件进程管理”项目由4个邮件模版组成，它们分别是一封介绍您产品的拓展邮件，和3封后续跟进的邮件，这些邮件消息将在被标记在KOL收件箱的顶部。目前，所有邮件进程管理都使用我们内部开发，根据大量实战经验精炼出来的邮件模板。您可以通过调整邮件进程管理页面中邮件模板的信息，为您的品牌和产品量身定制邮件，很快您将可以制作您专有的邮件模板！',
                },
                {
                    title: '',
                    description:
                        '我们会对邮件进行追踪，一旦KOL做出回复，他们将被转移到“达人管理系统”，KOL的回复将会在收件箱中显示。',
                },
                {
                    title: '怎么使用？',
                    description:
                        '我们建议创建几个不同的“邮件进程管理项目”，理想的情况是为您希望合作的类别或垂直领域的每个KOL至少创建一个邮件进程管理项目。例如，如果我想推广小米手环8这样的智能手表，我会为“科技爱好者”、“日常健身专家”和“生产力黑客”创建“邮件进程管理”，然后我可以为每个组别定制模版板，这样我发送的邮件能更有针对性更显个性化，也能大幅提升回复率！',
                },
                {
                    title: '',
                    description:
                        '创建新的“邮件进程管理项目”后，您需要为您的公司和产品先设置，这些变量将用于填写有关公司和产品的信息。您可以使用右上角的“更新模板变量”按钮从序列内部执行此操作。您需要完成此步骤才能发送电子邮件。',
                },
                {
                    title: '',
                    description: '"邮件进程管理项目"设置完成后，您可以将其设置为手动启动或自动启动。',
                },
                {
                    title: '',
                    description:
                        '当您的"邮件进程管理项目"为设置为手动启动时，它会把所有添加的KOL放在 "急需回复 "栏中，您需要自己点击“触发项目“按钮来安排和发送电子邮件。',
                },

                {
                    title: '',
                    description:
                        '如果您将“邮件进程管理项目“设置为自动启动时，那么您添加的所有具有可用电子邮件地址的KOL都将自动安排并向其发送电子邮件。',
                },
                {
                    title: '',
                    description:
                        '我们建议您使用自动启动功能，让整个过程更轻松！我们建议最好在一开始的时候联系更多的有潜力的KOL，然后在他们回复后，再更有选择性的挑选合作对象。',
                },
                {
                    title: '',
                    description:
                        '有些有KOL选择不在自己的简介中显示联系信息，因此我们在分析他们的社交媒体资料时无法收集到这些信息。在 Youtube 上，有时可以在个人简介中找到其联系信息。如果您能找到　KOL的电子邮件地址，您可以将其添加到他们的个人资料中的 "急需回复 "部分，然后我们就可以安排和发送他们的序列邮件了。',
                },
            ],
        },
        templates: {
            title: '模版',
            url: '/sequences',
            sections: [
                {
                    title: '什么是模版?',
                    description:
                        '模板是预先构建的电子邮件蓝图，其中包括 "变量"，以确保您发送的每封电子邮件都是为您要联系的KOL而定制的。每个序列使用 4 个不同的模板、一封初始邮件和 3 封后续邮件，这些信息将每隔几天自动发送一次，以提高您收到回复的几率',
                },
                {
                    title: '',
                    description:
                        '它们使用您提供的信息，以及我们从KOL报告中提取的信息来定制发送的每封电子邮件，省去了自己复制和粘贴的麻烦。',
                },
                {
                    title: '如何使用模版',
                    description:
                        '在开始发送序列中的电子邮件之前，您需要设置每个变量将使用的内容，您可以通过 “邮件进程管理项目“页面右上角的 "更新模板变量 "按钮进行设置。',
                },
                {
                    title: '',
                    description:
                        '我们已经预制了一套灵活、高效的模板供您使用，同时我们还在努力提高您制作自己模板的能力。这些都是经过实战检验的模板，我们在内部使用时取得了很好的效果。',
                },
            ],
        },
        inbox: {
            title: '收件箱',
            url: '/inbox',
            sections: [
                {
                    title: '',
                    description:
                        '在收件箱中，您可以查看所有外联电子邮件的回复，以及与所有KOL进行的后续对话。您可以直接在平台上打开邮件并回复！',
                },
                {
                    title: '',
                    description: '收件箱与KOL档案相连，您可以在一个地方获得所需的所有信息。',
                },
            ],
        },
        influencerProfile: {
            title: 'KOL 档案',
            url: '/influencer-manager',
            sections: [
                {
                    title: '如何使用KOL档案',
                    description:
                        '您可以通过合作来跟进KOL的状态，帮助您跟进每个人在漏斗中的进展。当您开始与越来越多的KOL合作时，设置和更新KOL的状态非常重要，有助于您随时掌握情况。您可以在 "KOL管理跟进 "中根据KOL的状态对其进行排序和筛选，也可以在回复KOL邮件时在收件箱中进行设置！',
                },
                {
                    title: '',
                    description:
                        '这里有专门的位置保存有关合作的所有重要信息，包括KOL的费用，预定内容的发布日期，甚至发货详情！',
                },
                {
                    title: '',
                    description:
                        '我们知道，除了合作的标准信息外，您还需要记住一些其他信息。这也是我们添加备注部分的原因，您可以添加有关KOL合作的长备注。保存备注后，点击个人档案上备注标题旁边的图标即可查看。',
                },
                {
                    title: '',
                    description:
                        '一旦您的KOL发布了内容，可以将 URL 添加到 "发布 "部分，这样我们就可以跟进参与情况，并将其显示在 "数据中心 "部分！',
                },
            ],
        },
        influencerManager: {
            title: 'Influencer Manager',
            url: '/influencer-manager',
            sections: [
                {
                    title: '如何使用KOL管理跟进',
                    description:
                        '您可以查看、筛选或搜索所有已回复您团队发出的电子邮件的KOL，他们目前正在您的合作漏斗中移动。点击其中一行即可调出KOL资料，或点击右侧收件箱图标进入与KOL的对话',
                },
                {
                    title: '',
                    description:
                        '切换 "View Only Mine"（只查看我的KOL），只查看您个人负责的KOL，或者将”View Only Mine”（只查看我的KOL)关掉，即可查看整个团队的KOL。',
                },
            ],
        },
        discover: {
            title: '发现KOL',
            url: '/dashboard',
            sections: [
                {
                    title: '基于主题的搜索',
                    description:
                        '我们根据网红达人在社交媒体上发布的内容和个人资料，为他们打上与特定领域相关的标签。这是一个可以帮助您寻找相关的网红达人的好方法。为了获得最佳的搜索结果，我们建议尽量将标签保持在3-4个相似主题范围内。如果添加与其他无关的标签，搜索结果会减少，因为很难找到同时与多个标签相关的网红达人！',
                },
                {
                    title: '关键词',
                    description:
                        '我们查看YouTube上最近发布的视频转文字文档和视频描述，找到提及您搜索关键词的网红达人。这是一个扩大搜索范围的好方法，可以将最近对您搜索关键词感兴趣的网红达人一并包括在内。我们通常会分析网红达人在视频中使用的短语或流行词的转录文本，来寻找符合您意向的网红达人。',
                },
                {
                    title: '标签',
                    description:
                        '在Instagram和TikTok上，我们推荐使用标签来扩大搜索范围。将相应的话题标签添加到搜索中，我们将向您展示最近发布的100篇帖子中使用了这些标签的网红达人，并一并展示您所使用的主题搜索结果。您可以添加多个标签以增加搜索结果，但有时网红达人自己添加的标签并不总是与其实际发布的内容密切相关。',
                },
                {
                    title: '按网红达人与受众进行筛选',
                    description:
                        '这些筛选条件将帮助您把检索到的结果限定在您的目标领域内。您可以根据所希望达成销售或建立品牌知名度的市场，来确定受众或网红达人的所在地。我们建议在您所希望达成销售的市场中将受众定位设置为大于30％。可以试着重点关注粉丝数量在10,000到1,000,000之间的尾部和腰部达人，以获得更好的投资回报率（ROI）。',
                },
                {
                    title: '互动率',
                    description:
                        '互动率的计算公式可能因行业而异，目前尚未有一种公认的标准方法来计算互动率。在boostbot.ai，我们通过用达人最近发布的30篇帖子的平均点赞数，除以粉丝总数来计算得出互动率。',
                },
                {
                    title: '联系方式',
                    description:
                        '要找到网红达人的联系方式，我们需要通过爬虫从他们的个人资料中抓取信息。但许多达人不愿在个人资料中披露这些信息，所以我们无法收集到。我们正在研究寻找新的方法来收集这些信息，但目前来看，仅显示有可用电子邮件的达人会比显示无电子邮件信息的达人更精确地定位。',
                },
            ],
        },
        account: {
            title: '监控您的使用情况',
            url: '/account',
            sections: [
                {
                    title: '管理团队合作',
                    description:
                        '“我的帐户”旨在为您跟踪具体的细节信息。您可以在此查看已在boostbot.ai上注册的团队成员、本月迄今为止的搜索次数，已查看网红达人的报告数，以及剩余的搜索额度。如果发现您的配额使用过快，请与我们的销售团队联系升级您的账户！',
                },
            ],
        },
    },
} as const;

export default guidePage;
