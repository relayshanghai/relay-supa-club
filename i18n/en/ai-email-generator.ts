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
        generatedSuccessfully: 'Generated successfully',
        generating: 'Generating. May take up to 30 seconds...',
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
            regenerateEmail: 'Generate New Email',
            regenerateSubject: 'Generate New Subject',
        },
        error: {
            maxLength: 'Maximum length reached',
        },
    },
};
export default aiEmailGenerator;
