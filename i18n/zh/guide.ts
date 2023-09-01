const guidePage = {
    welcome: '欢迎来到',
    welcomeDescription: '需要帮助吗？请查看以下主题，了解有关我们平台的更多信息！',
    goBack: '返回指南',
    goto: '前往',
    learnMore: '了解更多',
    cards: {
        sequences: {
            title: 'Sequences',
            description:
                'Sequences are automated series of email templates that we schedule, send and track to automate your influencer outreach and save hours of manual work each week.',
        },
        templates: {
            title: 'Templates',
            description:
                'Emails, but magic! We pull information from the influencer profile and variables you set in the sequence to customize each sequence email before it’s sent. Like we said, magic!',
        },
        inbox: {
            title: 'Inbox',
            description: 'No more switching between your email window, and relay.club.',
        },
        influencerProfile: {
            title: 'Influencer Profile',
            description:
                'Keep track of all your collab data and ditch the spreadsheet! The Influencer Profile is a tool dedicated to organizing and streamlining the collaboration process.',
        },
        influencerManager: {
            title: 'Influencer Manager',
            description:
                'Get a birds eye view of your in-progress collabs, and never let another influencer slip through the cracks.',
        },
        discover: {
            title: '发现KOL',
            description:
                '我们的数据库涵盖了3个平台共计超过2.75亿个的红人帐户，并提供数据驱动工具助您找到完美的网红达人。',
        },
        performance: {
            title: '追踪绩效',
            description: '您将不再需要电子表格 - 只需输入内容链接，我们将为您追踪浏览量、点赞数、评论和销售情况！',
        },
        account: {
            title: '监控您的使用情况',
            description: '查看谁有您管理项目的访问权，以及您打开了多少位网红达人的档案。',
        },
    },
    modalInfo: {
        influencerManager: {
            title: 'Influencer Manager',
            url: '/influencer-manager',
            sections: [
                {
                    title: 'How to use the Influencer Manager',
                    description:
                        'You can view, filter, or search through all the influencers that have responded to your teams outreach emails, and are currently moving through your collab funnel. Pull up the Influencer Profile by clicking on one of the rows, or go to your conversation with them by clicking on their Inbox icon on the right.',
                },
                {
                    title: '',
                    description:
                        'Toggle “View Only Mine” to see just the influencers you’re personally responsible for, or keep an eye on the whole team by toggling it off.',
                },
            ],
        },
        influencerProfile: {
            title: 'Influencer Profile',
            url: '/sequence',
            sections: [
                {
                    title: 'How to use the Influencer Profile',
                    description:
                        'You can track the Influencer’s status through the collab, helping to keep track of everyone moving through your funnel. Setting and updating the status of your influencers is super important to help you keep on top of things as you start working with more and more influencers. You’ll be able to sort and filter your influencers by their status in the Influencer Manager, and you can set it from right there in the Inbox when you’re responding to their emails!',
                },
                {
                    title: '',
                    description:
                        'There are dedicated spots to save all the most important information regarding a collab, from the influencers fee, scheduled post date for the content and even shipping details!',
                },
                {
                    title: '',
                    description:
                        'We know there’s going to be things that you need to remember outside of the standard information for a collab. That’s why we added the notes section for you to add longer comments regarding your influencer collab. Once a note is saved, it can be viewed by clicking on the icon beside the Notes title on the profile.',
                },
                {
                    title: '',
                    description:
                        'Once your influencer has posted their content, add the URL to the Posts section so we can track the engagements for you to display in the Performance section!',
                },
            ],
        },
        inbox: {
            title: 'Inbox',
            url: '/inbox',
            sections: [
                {
                    title: '',
                    description:
                        'The Inbox is where you’ll be able to access all the replies to your outreach emails, and follow-up conversations with influencers. You’ll be able to open that message and reply to the right there on the platform!',
                },
                {
                    title: '',
                    description:
                        'With the Inbox connected to the Influencer Profile you’ll have all the context you need, all in one place.',
                },
            ],
        },
        templates: {
            title: 'Templates',
            url: '/sequences',
            sections: [
                {
                    title: 'What are Templates?',
                    description:
                        'Templates are pre-built email blueprints that include ‘Variables’ to make sure each email you send is customized for the influencer you’re trying to reach. Each sequence uses 4 different templates, an initial outreach, and 3 follow-up messages that will go out automatically every few days to boost your chances of a reply.',
                },
                {
                    title: '',
                    description:
                        'They use information provided by you, as well as information we pull from the influencers report to tailor each emails that goes out, without any of the hassle of copying and pasting yourself',
                },
                {
                    title: 'How to use Templates',
                    description:
                        'Before you can start sending out emails in your sequence, you’ll need to set the content that each variable will use, you can do this from the “Update Templates Variables” button in the top right corner of the “Sequence” page.',
                },
                {
                    title: '',
                    description:
                        'We’ve pre-built a set of flexible, and highly effective templates for you to use while we work on building the ability to let you make your own templates. These are battle-tested templates we use internally to great success.',
                },
            ],
        },
        sequences: {
            title: 'Sequences',
            url: '/sequences',
            sections: [
                {
                    title: 'What are Sequences',
                    description:
                        'A Sequence is like a playlist email templates that will be customized, scheduled and automatically sent to an Influencer you add from Discover or BoostBot AI search. So you can think of the Sequence both as the set of scheduled emails, and as the group of influencers you’ve added to it.',
                },
                {
                    title: '',
                    description:
                        'Each sequence consists of 4 email templates, an Outreach message that explains your product and 3 follow-up messages to flag your message to the top of the influencers inbox. Right now all sequences use our internally developed an battle tested templates. You can tailor them to your brand and product by updating the template variables in the Sequence page, and soon you’ll even be able to make your own templates!',
                },
                {
                    title: '',
                    description:
                        'We will track the emails, and once the influencer responds, they’ll be moved to the Influencer Manager, and their response will display in the Inbox. ',
                },
                {
                    title: '',
                    description:
                        'We recommend creating a few different sequences, at least one for each genre or niche of influencers you want to collaborate with is ideal. For example if I wanted to promote a smart watch like the Mi Band 8, I would create sequences for ‘Tech Enthusiasts’, ‘Workout Routine Specialists’, and ‘Productivity Hackers’. Then I can adjust my templates and variables for each group so my emails will feel more personalized, and have a better reply rate!',
                },
                {
                    title: 'How to use them',
                    description:
                        'Once you create a new sequence, you’ll need to set the variables that will be used to fill in the information about your company and product. You can do this from inside the sequence using the Update Template Variables button in the top right corner. You’ll need to complete this step to be able to send emails.',
                },
                {
                    title: '',
                    description:
                        'After your sequence is set up, you’ll be able to set it to either Manual Start, or Auto Start.',
                },
                {
                    title: '',
                    description:
                        'When your sequence is set to Manual Start, it will collect all influencers added to it in the ‘Needs Attention’ tab for you, you will need to click the Trigger Sequence button yourself to schedule and send the emails.',
                },
                {
                    title: '',
                    description:
                        'If you set your sequence to Auto Start, then any influencer with an email address available that you add to the sequence will automatically have their emails scheduled and sent to them.',
                },
                {
                    title: '',
                    description:
                        'We recommend using Auto start to make your life easier! It’s better to email lots of potential influencers, and then be more selective about who to work with after they reply.',
                },
                {
                    title: '',
                    description:
                        'Some influencers choose not to display their contact information in their bio, and so we aren’t able to collect it when we are analyzing their social media profile. On youtube, it is sometimes available in the ‘About’ section of the profile. If you can find the influencers email address, you can add it to their profile in the ‘Needs Attention’ section, then we can schedule and send their sequence emails.',
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
                        '互动率的计算公式可能因行业而异，目前尚未有一种公认的标准方法来计算互动率。在relay.club，我们通过用达人最近发布的30篇帖子的平均点赞数，除以粉丝总数来计算得出互动率。',
                },
                {
                    title: '联系方式',
                    description:
                        '要找到网红达人的联系方式，我们需要通过爬虫从他们的个人资料中抓取信息。但许多达人不愿在个人资料中披露这些信息，所以我们无法收集到。我们正在研究寻找新的方法来收集这些信息，但目前来看，仅显示有可用电子邮件的达人会比显示无电子邮件信息的达人更精确地定位。',
                },
            ],
        },
        outreach: {
            title: 'Outreach',
            url: '/sequences',
            sections: [
                {
                    title: 'Sequences',
                    description: `A Sequence is like a playlist email templates that will be customized, scheduled and automatically sent to an Influencer you add from Discover or BoostBot AI search. So you can think of the Sequence both as the set of scheduled emails, and as the group of influencers you’ve added to it.
                        
                        Each sequence consists of 4 email templates, an Outreach message that explains your product and 3 follow-up messages to flag your message to the top of the influencers inbox. Right now all sequences use our internally developed an battle tested templates. You can tailor them to your brand and product by updating the template variables in the Sequence page, and soon you’ll even be able to make your own templates.
                        
                        We will track the emails, and once the influencer responds, they’ll be moved to the Influencer Manager, and their response will display in the Inbox.
                        
                        We recommend creating a few different sequences, at least one for each genre or niche of influencers you want to collaborate with is ideal. For example if I wanted to promote a smart watch like the Mi Band 8, I would create sequences for ‘Tech Enthusiasts’, ‘Workout Routine Specialists’, and ‘Productivity Hackers’. Then I can adjust my templates and variables for each group so my emails will feel more personalized, and have a better reply rate!
                        
                        After your sequence is set up, you’ll be able to set it to either Manual Start, or Auto Start. 

                        When your sequence is set to Manual Start, it will collect all influencers added to it in the ‘Needs Attention’ tab for you, you will need to click the Trigger Sequence button yourself to schedule and send the emails. 

                        If you set your sequence to Auto Start, then any influencer with an email address available that you add to the sequence will automatically have their emails scheduled and sent to them.

                        We recommend using Auto start to make your life easier! It’s better to email lots of potential influencers, and then be more selective about who to work with after they reply.

                        Some influencers choose not to display their contact information in their bio, and so we aren’t able to collect it when we are analyzing their social media profile. On youtube, it is sometimes available in the ‘About’ section of the profile. If you can find the influencers email address, you can add it to their profile in the ‘Needs Attention’ section, then we can schedule and send their sequence emails.                                                 `,
                },
                {
                    title: 'Templates',
                    description: `Like emails, but magic!

                        Templates are pre-built email blueprints that include ‘Variables’ to make sure each email you send is customized for the influencer you’re trying to reach. Each sequence uses 4 different templates, an initial outreach, and 3 follow-up messages that will go out automatically every few days to boost your chances of a reply. 

                        The templates use information provided by you, as well as information we pull from the influencers report to tailor each emails that goes out, without any of the hassle of copying and pasting yourself

                        Before you can start sending out emails in your sequence, you’ll need to set the content that each variable will use, you can do this from the “Update Templates Variables” button in the top right corner of the “Sequence” page. 

                        We’ve pre-built a set of flexible, and highly effective templates for you to use while we work on building the ability to let you make your own templates. These are battle-tested templates we use internally to great success`,
                },
                {
                    title: 'Inbox',
                    description: `The Inbox is where you’ll be able to access all the replies to your outreach emails, and follow-up conversations with influencers. You’ll be able to open that message and reply to the right there on the platform!

                        No more switching between your email window, and relay.club. With the Inbox connected to the Influencer Profile you’ll have all the context you need, all in one place.`,
                },
                {
                    title: 'Influencer Profile',
                    description: `The Influencer Profile is a tool dedicated to organizing and streamlining the collaboration process. 

                        You can track the Influencer’s status through the collab, helping to keep track of everyone moving through your funnel. Setting and updating the status of your influencers is super important to help you keep on top of things as you start working with more and more influencers. You’ll be able to sort and filter your influencers by their status in the Influencer Manager, and you can set it from right there in the Inbox when you’re responding to their emails!
                        
                        There are dedicated spots to save all the most important information regarding a collab, from the influencers fee, scheduled post date for the content and even shipping details!
                        
                        We know there’s going to be things that you need to remember outside of the standard information for a collab. That’s why we added the notes section for you to add longer comments regarding your influencer collab. Once a note is saved, it can be viewed by clicking on the icon beside the Notes title on the profile. 
                        
                        Once your influencer has posted their content, add the URL to the Posts section so we can track the engagements for you to display in the Performance section!`,
                },
                {
                    title: 'Influencer Manager',
                    description: `The influencer manager is where you can see your entire teams influencers, and get a birds eye view of your in-progress collabs. 

                        You can view, filter, or search through all the influencers that have responded to your teams outreach emails, and are currently moving through your collab funnel. Pull up the Influencer Profile by clicking on one of the rows, or go to your conversation with them by clicking on their Inbox icon on the right.

                        Toggle “View Only Mine” to see just the influencers you’re personally responsible for, or keep an eye on the whole team by toggling it off. 

                        It’s the hub of your influencer marketing efforts, where you can get an overview of your collabs and never let anyone slip through the cracks.`,
                },
            ],
        },
        performance: {
            title: '追踪绩效',
            url: '/performance',
            sections: [
                {
                    title: '您提供链接，我们负责跟踪数据',
                    description:
                        '达人发布帖子后，你需要在项目管理的“已发布”状态下，点击“内容”按钮并添加链接，即可开始追踪总浏览量、点赞数和评论。通过点击控制面板左侧的“数据中心”按钮，您可以查看公司的整体绩效表现，包括帖子总数和总的浏览量、点赞数、评论和销售情况的摘要。',
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
                        '“我的帐户”旨在为您跟踪具体的细节信息。您可以在此查看已在relay.club上注册的团队成员、本月迄今为止的搜索次数，已查看网红达人的报告数，以及剩余的搜索额度。如果发现您的配额使用过快，请与我们的销售团队联系升级您的账户！',
                },
            ],
        },
    },
};

export default guidePage;
