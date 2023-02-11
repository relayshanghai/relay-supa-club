const aiEmailGenerator = {
    index: {
        title: 'AI Email Generator',
        description: 'Generate emails to influencers with our AI Email Generator',
        status: {
            inProgress: 'In Progress',
            notStarted: 'Not Started',
            completed: 'Completed',
            all: 'All',
        },
        generateEmail: 'Generate Email',
        generateSubject: 'Generate Subject',
        loading: 'Loading...',
        requestError: 'Oops, please check your data and try again.',
    },
    email: {
        dayLimit: 'You can only send an influencer an email every 24 hours to avoid spam.',
        emailSent: 'Email sent successfully',
        sendEmail: 'Send Mail',
        pickTemplate: 'Pick a template',
        pickTemplateDescr:
            'Pick one of our powerful pre-written templates to connect to your favorite influencer. Increase your chances of getting a reply.',
        initialEmail: 'Initial Email',
        followUpEmail: 'Follow Up Email',
        writeOwnMessage: 'Or write your own message',
        sendEmailError: 'Oops, something went wrong. Please try again.',
        sendAndGoToNext: 'Send and Open Next Influencer',
        sendToAll: 'Send to All influencers with this template',
    },
    form: {
        placeholder: {
            senderName: "Sender's Name",
            productName: 'Product Name',
            productDescription: 'Product Description',
            influencerName: 'Influencer Name',
            brandName: "Your Brand's Name",
            instructions: 'Instructions for the influencer',
            subjectLine: 'Generated Subject Line',
            generatedEmail: 'Generated Email',
        },
        label: {
            senderName: "Sender's Name",
            productName: 'Product Name',
            productDescription: 'Product Description',
            influencerName: "Influencer's Name",
            brandName: 'Brand Name',
            instructions: 'Instructions for the influencer',
            language: 'Email Language',
            subjectLine: 'Generated Subject Line',
            generatedEmail: 'Generated Email',
            copyEmailButton: 'Copy Email',
            copySubjectButton: 'Copy Subject',
        },
        error: {
            maxLength: 'Maximum length reached',
        },
    },
};
export default aiEmailGenerator;
