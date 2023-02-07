import { Layout } from 'src/modules/layout';
import { useCallback, useState } from 'react';
import { Button } from 'src/components/button';
import { t } from 'i18next';
import { Input } from 'src/components/input';
import { InputTextArea } from 'src/components/textarea';
import { nextFetch } from 'src/utils/fetcher';
import { AIEmailGeneratorGetQuery, AIEmailGeneratorGetResult } from 'pages/api/ai-email-generator';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import { Transition } from '@headlessui/react';

const AIImageGenerator = () => {
    const [brandName, setBrandName] = useState('');
    const [language, setLanguage] = useState<'en-US' | 'zh'>('en-US');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState('');

    const generateEmail = useCallback(async () => {
        setLoading(true);
        setGeneratedEmail('');
        const body: AIEmailGeneratorGetQuery = {
            brandName,
            language,
            influencerName,
            productName,
            productDescription,
            instructions,
            senderName,
        };
        const res = await nextFetch<AIEmailGeneratorGetResult>('ai-email-generator', {
            method: 'post',
            body: JSON.stringify(body),
        });
        setGeneratedEmail(res[0].text as string);
        setLoading(false);
        return res;
    }, [
        brandName,
        language,
        influencerName,
        productName,
        productDescription,
        instructions,
        senderName,
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
                <div className="flex flex-row items-center justify-center gap-10 mt-10 w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col h-full items-center justify-end"
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
                            placeholder={
                                t('aiEmailGenerator.form.placeholder.productName') as string
                            }
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
                        />
                        <Button disabled={loading} type="submit">
                            {loading
                                ? t('aiEmailGenerator.index.loading')
                                : t('aiEmailGenerator.index.generateEmail')}
                        </Button>
                    </form>
                    <Transition
                        show={generatedEmail.length > 1}
                        enter="transition-all duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="flex flex-col items-center justify-end h-full"
                    >
                        <textarea
                            className="ring-opacity-5 max-w-lg h-full overflow-y-auto placeholder-gray-400 ring-black appearance-none bg-white rounded-md block w-96 px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:outline-none my-2"
                            value={generatedEmail}
                        />
                        <Button onClick={() => copyToClipboard(generatedEmail)}>Copy Text</Button>
                    </Transition>
                </div>
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
