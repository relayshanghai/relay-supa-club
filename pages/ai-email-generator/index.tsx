import { Layout } from 'src/modules/layout';
import { useCallback, useState } from 'react';
import { Button } from 'src/components/button';
import { t } from 'i18next';
import { Input } from 'src/components/input';
import { InputTextArea } from 'src/components/textarea';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { AIEmailGeneratorGetQuery, AIEmailGeneratorGetResult } from 'pages/api/ai-email-generator';
import useSWR from 'swr';

const AIImageGenerator = () => {
    const [brandName, setBrandName] = useState('');
    const [language, setLanguage] = useState<'en-US' | 'zh'>('en-US');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState('');

    const { data: generatedEmail, mutate } = useSWR(
        'ai-email-generate',
        async (path) =>
            await nextFetchWithQueries<AIEmailGeneratorGetQuery, AIEmailGeneratorGetResult>(path, {
                brandName: brandName,
                language: language,
                influencerName: influencerName,
                productName: productName,
                productDescription: productDescription,
                instructions: instructions,
                senderName: senderName,
            }),
    );

    const generateEmail = useCallback(async () => {
        const body: AIEmailGeneratorGetQuery = {
            brandName: brandName,
            language: language,
            influencerName: influencerName,
            productName: productName,
            productDescription: productDescription,
            instructions: instructions,
            senderName: senderName,
        };

        const res = await nextFetch<AIEmailGeneratorGetQuery>('subscriptions/create', {
            method: 'post',
            body: JSON.stringify(body),
        });

        mutate();
        return res;
    }, [
        brandName,
        language,
        influencerName,
        productName,
        productDescription,
        instructions,
        senderName,
        mutate,
    ]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        generateEmail();
    };

    const languageOptions = [
        { value: 'en-US', label: 'English' },
        { value: 'zh', label: '中文' },
    ];

    return (
        <Layout>
            <div className="flex flex-col items-center p-6 w-full h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">{t('aiEmailGenerator.index.title')}</h1>
                    <p className="text-sm mb-4">{t('aiEmailGenerator.index.description')}</p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-10 items-center justify-center mb-4 sm:mb-6"
                >
                    <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
                        <div>{t('aiEmailGenerator.form.label.language')}</div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en-US' | 'zh')}
                            className="ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2"
                        >
                            {languageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Input
                        label={t('aiEmailGenerator.form.label.brandName') as string}
                        placeholder={t('aiEmailGenerator.form.placeholder.brandName') as string}
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                    />
                    <Input
                        label={t('aiEmailGenerator.form.label.senderName') as string}
                        placeholder="Your Name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                    />
                    <Input
                        label={t('aiEmailGenerator.form.label.influencerName') as string}
                        placeholder={
                            t('aiEmailGenerator.form.placeholder.influencerName') as string
                        }
                        value={influencerName}
                        onChange={(e) => setInfluencerName(e.target.value)}
                        required
                    />
                    <Input
                        label={t('aiEmailGenerator.form.label.productName') as string}
                        placeholder={t('aiEmailGenerator.form.placeholder.productName') as string}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <InputTextArea
                        label={t('aiEmailGenerator.form.label.productDescription') as string}
                        placeholder={t('campaigns.creatorModal.messagePlaceholder') as string}
                        value={productDescription}
                        onChange={(e) => {
                            if (e.target.value.length > 100) {
                                return;
                            }
                            setProductDescription(e.target.value);
                        }}
                        required
                    />
                    <InputTextArea
                        label={t('aiEmailGenerator.form.label.instructions') as string}
                        placeholder={t('campaigns.creatorModal.messagePlaceholder') as string}
                        value={instructions}
                        onChange={(e) => {
                            if (e.target.value.length > 100) {
                                return;
                            }
                            setInstructions(e.target.value);
                        }}
                        required
                    />
                    <Button type="submit">{t('aiEmailGenerator.index.generateEmail')}</Button>
                </form>
                {generatedEmail && (
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4">
                            {t('aiEmailGenerator.index.generatedEmail')}
                        </h1>
                        <div className="flex flex-col items-center">
                            {generatedEmail.map((email, index) => (
                                <p key={index} className="text-sm mb-4">
                                    {email.text}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
