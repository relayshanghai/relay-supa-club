const guidePage = {
    welcome: 'Welcome to',
    welcomeDescription: 'Need help? Check out the topics below for more information about our platform!',
    goBack: 'Back to Guide',
    goto: 'Go to',
    learnMore: 'Learn More',
    cards: {
        boostbot: {
            title: 'BoostBot',
            description:
                "Stop spending hours on finding the right influencers. With BoostBot's AI technology, you can start contacting the perfect influencers to do product reviews and brand collabs in minutes!",
        },
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
            description: 'No more switching between your email window, and boostbot.ai.',
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
            title: 'Discover KOL',
            description:
                'With a database of over 275 million accounts across 3 platforms, we give you the data driven tools you need to find the perfect influencers.',
        },
        account: {
            title: 'Monitor Your Usage',
            description:
                'Check to see who has access to your campaigns and how many influencer profiles you have opened.',
        },
    },
    modalInfo: {
        boostbot: {
            title: 'BoostBot',
            url: '/boostbot',
            sections: [
                {
                    title: 'How BoostBot Works',
                    description:
                        'BoostBot is an AI assisted search tool that finds influencers who can successfully market products on social media. Just input a description of your product or service - in any language - and BoostBot will think of relevant topics to search for, find influencers from a database of 200+ million, and optimize the results against metrics such as audience following, engagement and location. The result is a large list of influencers, along with their contact information, so you can get in touch with them for a brand deal or collaboration. ',
                    demo: 'boostbot_demo.gif',
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
                        'Once you create a new sequence, you’ll need to set the variables that will be used to fill in the information about your company and product. You can do this from inside the sequence using the View sequence templates button in the top right corner. You’ll need to complete this step to be able to send emails.',
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
        influencerProfile: {
            title: 'Influencer Profile',
            url: '/influencer-manager',
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
        discover: {
            title: 'Discover KOL',
            url: '/dashboard',
            sections: [
                {
                    title: 'Topic-based Search',
                    description:
                        'By analyzing profile and content information for all influencer accounts, we use topics as a way of labeling the influencers according to their actual content and channel focus. Topics are a great way to find the most relevant influencers in a specific niche. Try keeping your topics to 3-4 similar topics for best results. If you add a topic unrelated to the others, results will decrease as it’s hard to find influencers that are relevant to diverse topics!',
                },
                {
                    title: 'Keywords',
                    description:
                        'We look at Youtube video transcripts and post descriptions for recent videos to find influencers talking about your keyword. This is a great way to broaden your search, and include influencers with a recent interest in your keyword alongside the results from your topic search. Try to think of a phrase, or buzzword that influencers you’re looking for would use in the video as we are examining their transcripts!',
                },
                {
                    title: 'Hashtags',
                    description:
                        'Hashtags are how we recommend broadening your searches on Instagram and TikTok. By adding hashtags into your search, we will show you influencers who have used these hashtags in their last 100 posts alongside the results from your topic search. You can include multiple hashtags to really broaden your results, however sometimes influencers will include hashtags that aren’t actually related to their content.',
                },
                {
                    title: 'Filter by Influencer and Audience',
                    description:
                        'These filters are used to limit the results you see to your target niche. You can target an audience or influencer location based on what markets you are looking to generate sales, or develop brand awareness. We recommend setting the audience location to greater than 30% in the market you’re looking to generate sales in. Try focusing on microinfluencer for better ROI by limiting the followers from 10k - 1m.',
                },
                {
                    title: 'Engagement Rate',
                    description:
                        'The formula for calculating engagement rate may vary across the industry as there isn’t one recognized way to calculate it. At boostbot.ai we divide Average Likes for the last 30 posts by the total number of followers.',
                },
                {
                    title: 'Contact Info',
                    description:
                        'To find the contact information for an influencer account, we need to scrape their information from their profile. Many influencers choose not to put this information in their profile, and so we aren’t able to collect it. We are working on new ways to collect this information, but for now showing only results with email available will be a much smaller pool of influencers than without.',
                },
            ],
        },
        account: {
            title: 'My Account',
            url: '/account',
            sections: [
                {
                    title: 'Manage your teams efforts',
                    description:
                        'The ‘My Account’ section is there to keep track of the details for you. See which team members are signed up on boostbot.ai, how many Searches and Influencer Reports you’ve opened so far this month, and how many you have left. If you find you’re running out too quickly, get in touch with our sales team to upgrade your account!',
                },
            ],
        },
    },
} as const;

export default guidePage;
