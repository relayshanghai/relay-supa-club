const aiEmailGenerator = {
    index: {
        title: 'AI 邮件生成器',
        description: '使用我们的 AI 邮件生成器生成邮件给KOL',
        status: {
            loading: '加载中...',
            generating: '生成中。这可能需要 30 秒钟...',
            requestError: '哎呀。请检查您的数据，然后重试。',
            generatedSuccessfully: '生成成功！',
        },
        generateEmail: '生成邮件',
        generateSubject: '生成主题',
        information: '请仅以英文输入详细信息。',
    },
    form: {
        placeholder: {
            senderName: '发件人的名字',
            productName: '产品名称',
            productDescription: '产品描述',
            influencerName: 'KOL 名称',
            brandName: '您的品牌的名称',
            instructions: 'KOL 的指令',
            subjectLine: '生成的主题行',
            generatedEmail: '生成的邮件',
        },
        label: {
            senderName: '发件人的名字',
            productName: '产品名称',
            productDescription: '产品描述',
            influencerName: 'KOL 名称',
            brandName: '您的品牌的名称',
            instructions: 'KOL 的指令',
            language: '邮件语言',
            subjectLine: '生成的主题行',
            generatedEmail: '生成的邮件',
            copyEmailButton: '复制邮件',
            copySubjectButton: '复制主题',
            regenerateEmail: '生成新邮件',
            regenerateSubject: '生成新主题',
        },
        error: {
            maxLength: '达到最大长度',
        },
    },
};
export default aiEmailGenerator;
