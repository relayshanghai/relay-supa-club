import type {
    AIEmailGeneratorPostBody,
    AIEmailGeneratorPostResult,
} from 'pages/api/ai-generate/email';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import { InputTextArea } from 'src/components/textarea';
import { Transition } from '@headlessui/react';
import { Button } from 'src/components/button';
import { nextFetch } from 'src/utils/fetcher';
import { useCallback, useState } from 'react';
import { Input } from 'src/components/input';
import { Layout } from 'src/modules/layout';
import { t } from 'i18next';
import { toast } from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger';
import {
    AIEmailSubjectGeneratorPostBody,
    AIEmailSubjectGeneratorPostResult,
} from 'pages/api/ai-generate/subject';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';

const AIImageGenerator = () => {
    const { profile } = useUser();
    const { company } = useCompany();

    const [brandName, setBrandName] = useState(company?.name || '');
    const [language, setLanguage] = useState<'en-US' | 'zh'>('en-US');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState(profile?.first_name || '');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [generatedSubject, setGeneratedSubject] = useState('');
    const [loadingSubject, setLoadingSubject] = useState(false);

    const MAX_CHARACTER_LENGTH = 600;

    const generateEmail = useCallback(async () => {
        setLoadingEmail(true);
        setGeneratedEmail('');
        const body: AIEmailGeneratorPostBody = {
            brandName,
            language,
            influencerName,
            productName,
            productDescription,
            instructions,
            senderName,
        };
        const res: AIEmailGeneratorPostResult = await nextFetch<AIEmailGeneratorPostResult>(
            'ai-generate/email',
            {
                method: 'post',
                body: JSON.stringify(body),
            },
        );

        if (res.length > 0) {
            setGeneratedEmail(res[0].text || '');
            setLoadingEmail(false);
        }

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

    const generateSubject = useCallback(async () => {
        setLoadingSubject(true);
        setGeneratedSubject('');
        const body: AIEmailSubjectGeneratorPostBody = {
            brandName,
            language,
            influencerName,
            productName,
            productDescription,
        };
        const res = await nextFetch<AIEmailSubjectGeneratorPostResult>('ai-generate/subject', {
            method: 'post',
            body: JSON.stringify(body),
        });

        if (res.length > 0) {
            setGeneratedSubject(res[0].text || '');
            setLoadingSubject(false);
        }

        return res;
    }, [brandName, language, influencerName, productName, productDescription]);

    const handleSubmit = async (e: any, type: 'subject' | 'email' | 'both') => {
        e.preventDefault();
        try {
            if (type === 'email') await generateEmail();
            else if (type === 'subject') await generateSubject();
            else {
                await generateEmail();
                await generateSubject();
            }
        } catch (e: any) {
            clientLogger(e, 'error');
            toast.error(t('aiEmailGenerator.index.requestError') || '');
            setGeneratedEmail('');
            setGeneratedSubject('');
            setLoadingEmail(false);
            setLoadingSubject(false);
        }
    };

    const removeExtraSpaces = (e: any) => {
        return e.target.value.replace(/\s+/g, ' ').trim();
    };

    const languageOptions = [
        { value: 'en-US', label: 'English' },
        { value: 'zh', label: '中文' },
    ];

    return (
        <Layout>
            <div className="flex flex-col items-center p-6 w-full h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t('aiEmailGenerator.index.title') || ''}
                    </h1>
                    <p className="text-sm mb-4">{t('aiEmailGenerator.index.description') || ''}</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-10 mt-10 w-full">
                    <form className="flex flex-col h-full items-center justify-end">
                        <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
                            <div>{t('aiEmailGenerator.form.label.language') || ''}</div>

                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en-US' | 'zh')}
                                className="ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 ring-transparent cursor-pointer sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2"
                            >
                                {languageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Input
                            label={t('aiEmailGenerator.form.label.brandName') || ''}
                            placeholder={t('aiEmailGenerator.form.placeholder.brandName') || ''}
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                        />
                        <Input
                            label={t('aiEmailGenerator.form.label.senderName') || ''}
                            placeholder={t('aiEmailGenerator.form.placeholder.senderName') || ''}
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                        />
                        <Input
                            label={t('aiEmailGenerator.form.label.influencerName') || ''}
                            placeholder={
                                t('aiEmailGenerator.form.placeholder.influencerName') || ''
                            }
                            value={influencerName}
                            onChange={(e) => setInfluencerName(e.target.value)}
                            required
                        />
                        <Input
                            label={t('aiEmailGenerator.form.label.productName') || ''}
                            placeholder={t('aiEmailGenerator.form.placeholder.productName') || ''}
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                        <InputTextArea
                            label={t('aiEmailGenerator.form.label.productDescription') || ''}
                            placeholder={t('campaigns.creatorModal.messagePlaceholder') || ''}
                            value={productDescription}
                            onChange={(e) => {
                                if (e.target.value.length > MAX_CHARACTER_LENGTH) {
                                    toast.error(t('aiEmailGenerator.form.error.maxLength'));
                                    return;
                                }
                                setProductDescription(e.target.value);
                            }}
                            required
                        />
                        <InputTextArea
                            label={t('aiEmailGenerator.form.label.instructions') || ''}
                            placeholder={t('campaigns.creatorModal.messagePlaceholder') || ''}
                            value={instructions}
                            onChange={(e) => {
                                if (e.target.value.length > MAX_CHARACTER_LENGTH) {
                                    toast.error(t('aiEmailGenerator.form.error.maxLength') || '');
                                    return;
                                }
                                setInstructions(e.target.value);
                            }}
                        />
                        <div className="flex flex-row gap-2 items-center">
                            <Button
                                disabled={loadingEmail && loadingSubject}
                                type="submit"
                                onClick={(e) => handleSubmit(e, 'both')}
                            >
                                {loadingEmail
                                    ? t('aiEmailGenerator.index.loading')
                                    : t('aiEmailGenerator.index.generateEmail') || ''}
                            </Button>
                        </div>
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
                        <InputTextArea
                            onBlur={removeExtraSpaces}
                            label={t('aiEmailGenerator.form.label.subjectLine') || ''}
                            value={generatedSubject}
                            onChange={(e) => {
                                setGeneratedSubject(e.target.value);
                            }}
                        />
                        <label className="flex flex-col text-xs text-gray-500 font-bold h-full w-full">
                            <div>{t('aiEmailGenerator.form.label.generatedEmail') || ''}</div>
                            <textarea
                                className="ring-opacity-5 text-black placeholder-gray-400 appearance-none bg-white rounded-md block h-full w-full px-3 py-2 border border-transparent shadow ring-1 ring-transparent sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2"
                                value={generatedEmail}
                            />
                        </label>
                        <Button
                            onClick={() => copyToClipboard(generatedEmail)}
                            disabled={loadingEmail || loadingSubject}
                        >
                            {t('aiEmailGenerator.form.label.copyTextButton') || ''}
                        </Button>
                    </Transition>
                </div>
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
