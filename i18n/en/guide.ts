const guidePage = {
    welcome: 'Welcome to',
    welcomeDescription: 'Need help? Check out the topics below for more information about our platform!',
    goBack: 'Back to Guide',
    goto: 'Go to',
    learnMore: 'Learn More',
    cards: {
        discover: {
            title: 'Discover KOL',
            description:
                'With a database of over 275 million accounts across 3 platforms, we give you the data driven tools you need to find the perfect influencers.',
        },
        outreach: {
            title: 'Outreach',
            description:
                'We’re extremely excited about our new Influencer Relationship Management ( IRM ) system, tailor made to help you plan, organize and execute your collaborations as easily as possible. Outreach is all centered around ‘Sequences’, an automated emailing tool that will schedule, send and track your outreach and follow-up emails with just the click of a button. Our Sequences use intelligent Templates that pull in information about your company, product and the influencers you’re trying to reach to customize each message. When an influencer replies, we’ll display it in our specialized Inbox, where you can discuss your collab and keep track of all your information in the Influencer Profile!',
        },
        performance: {
            title: 'Track Performance',
            description:
                'No more spreadsheets - just input the content link and we’ll track views, likes, comments, and sales for you!',
        },
        account: {
            title: 'Monitor Your Usage',
            description:
                'Check to see who has access to your campaigns and how many influencer profiles you have opened.',
        },
    },
    modalInfo: {
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
                        'The formula for calculating engagement rate may vary across the industry as there isn’t one recognized way to calculate it. At relay.club we divide Average Likes for the last 30 posts by the total number of followers.',
                },
                {
                    title: 'Contact Info',
                    description:
                        'To find the contact information for an influencer account, we need to scrape their information from their profile. Many influencers choose not to put this information in their profile, and so we aren’t able to collect it. We are working on new ways to collect this information, but for now showing only results with email available will be a much smaller pool of influencers than without.',
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
            title: 'Performance',
            url: '/performance',
            sections: [
                {
                    title: 'You provide the link, we’ll handle the tracking ',
                    description:
                        'Once the influencer has posted, click on the “Content” button in the campaign table under the ‘Posted’ tab to add the post directly to your campaign. From there, we will start tracking the overall views, likes, and comments. You can check out your company’s overall performance by clicking “Performance” on the left side of your dashboard. Here you will see overall posts, and a summary of total views, likes, comments, and sales.',
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
                        'The ‘My Account’ section is there to keep track of the details for you. See which team members are signed up on relay.club, how many Searches and Influencer Reports you’ve opened so far this month, and how many you have left. If you find you’re running out too quickly, get in touch with our sales team to upgrade your account!',
                },
            ],
        },
    },
};

export default guidePage;
