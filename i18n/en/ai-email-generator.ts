const aiEmailGenerator = {
    index: {
        title: 'AI Email Generator',
        description: 'Generate emails to influencers with our AI Email Generator',
        status: {
            loading: 'Loading...',
            generating: 'Generating. This may take up to 30 seconds...',
            requestError: 'Oops. Please check your data and try again.',
            generatedSuccessfully: 'Generated successfully!',
        },
        generateEmail: 'Generate Email',
        generateSubject: 'Generate Subject',
        information: 'Please enter the details in English only.',
    },
    form: {
        placeholder: {
            senderName: "Sender's Name",
            productName: 'Product Name',
            productDescription: 'Product Description',
            influencerName: 'Influencer Name',
            brandName: "Your Brand's Name",
            instructions: 'Instructions for the Influencer',
            subjectLine: 'Generated Subject Line',
            generatedEmail: 'Generated Email',
        },
        label: {
            senderName: "Sender's Name",
            productName: 'Product Name',
            productDescription: 'Product Description',
            influencerName: "Influencer's Name",
            brandName: 'Brand Name',
            instructions: 'Instructions for the Influencer',
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
