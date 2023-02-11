import type {
    AIEmailGeneratorPostBody,
    AIEmailGeneratorPostResult,
} from 'pages/api/ai-generate/email';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import { InputTextArea } from 'src/components/textarea';
import { Button } from 'src/components/button';
import { nextFetch } from 'src/utils/fetcher';
import { useCallback, useEffect, useState } from 'react';
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
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

const AIImageGenerator = () => {
    const { profile } = useUser();
    const { company } = useCompany();

    const [brandName, setBrandName] = useState('');
    const [language, setLanguage] = useState<'en-US' | 'zh'>('en-US');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [generatedSubjects, setGeneratedSubjects] = useState<AIEmailSubjectGeneratorPostResult>(
        [],
    );
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

    useEffect(() => {
        setBrandName(company?.name || '');
        setSenderName(profile?.first_name || '');
    }, [profile, company]);

    const MAX_CHARACTER_LENGTH = 600;

    // Remove leading space
    const removeLeadingSpace = (text: string) => {
        return text.replace(/^\s+/, '');
    };

    const generateSubject = useCallback(async () => {
        setLoadingSubject(true);
        setGeneratedSubjects([]);
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
            const formattedRes = res.map((item) => {
                return removeLeadingSpace(item);
            });

            setGeneratedSubjects(formattedRes || []);
            setLoadingSubject(false);
        }
    }, [brandName, language, influencerName, productName, productDescription]);

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

        if (!res.text) {
            throw new Error('Email generation failed');
        }
        setGeneratedEmail(removeLeadingSpace(res.text));
        setLoadingEmail(false);
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
            resetFields();
        }
    };

    const resetFields = () => {
        setGeneratedEmail('');
        setGeneratedSubjects([]);
        setLoadingEmail(false);
        setLoadingSubject(false);
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
                {/* HEADING */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t('aiEmailGenerator.index.title') || ''}
                    </h1>
                    <p className="text-sm mb-4">{t('aiEmailGenerator.index.description') || ''}</p>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col lg:flex-row lg:items-start items-center justify-center gap-10 mt-10 w-full lg:h-full">
                    {/* INPUT FORM SECTION */}
                    <form className="flex flex-col h-full items-center justify-start w-full md:w-1/3">
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
                                disabled={loadingEmail || loadingSubject}
                                type="submit"
                                onClick={(e) => handleSubmit(e, 'both')}
                            >
                                {loadingEmail
                                    ? t('aiEmailGenerator.index.loading')
                                    : t('aiEmailGenerator.index.generateEmail') || ''}
                            </Button>
                        </div>
                    </form>

                    {/* EMAIL AND SUBJECT SECTION */}
                    <div
                        className={`${
                            generatedEmail.length < 1 || generatedSubjects.length < 1
                                ? 'opacity-0 hidden'
                                : 'opacity-100'
                        } flex transition-all duration-300 max-w-xl mb-10 flex-col items-center justify-start w-full md:w-2/3 gap-5 h-full`}
                    >
                        <div className="w-full flex flex-col items-center justify-center">
                            <div className="w-full flex flex-row gap-2">
                                <ArrowLeftCircleIcon
                                    className="w-10 text-tertiary-400 hover:text-primary-500 cursor-pointer"
                                    onClick={() => {
                                        setCurrentSubjectIndex(
                                            (prev) => (prev - 1) % generatedSubjects.length,
                                        );
                                    }}
                                />
                                <InputTextArea
                                    onBlur={removeExtraSpaces}
                                    label={t('aiEmailGenerator.form.label.subjectLine') || ''}
                                    value={generatedSubjects[currentSubjectIndex]}
                                    onChange={() => {
                                        return;
                                    }}
                                    rows={3}
                                />
                                <ArrowRightCircleIcon
                                    className="w-10 text-tertiary-400 hover:text-primary-500 cursor-pointer"
                                    onClick={() => {
                                        setCurrentSubjectIndex(
                                            (prev) => (prev + 1) % generatedSubjects.length,
                                        );
                                    }}
                                />
                            </div>
                            <Button
                                onClick={() =>
                                    copyToClipboard(generatedSubjects[currentSubjectIndex])
                                }
                                disabled={loadingEmail || loadingSubject}
                            >
                                {t('aiEmailGenerator.form.label.copySubjectButton') || ''}
                            </Button>
                        </div>
                        <div className="w-full flex flex-col justify-center items-center h-full ">
                            <label className="flex flex-col text-xs text-gray-500 font-bold h-full w-full">
                                <div>{t('aiEmailGenerator.form.label.generatedEmail') || ''}</div>
                                <textarea
                                    className="ring-opacity-5 text-black placeholder-gray-400 appearance-none bg-white rounded-md block h-[500px] lg:h-full w-full px-3 py-2 border border-transparent shadow ring-1 ring-transparent sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2"
                                    value={generatedEmail + generatedEmail}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </label>
                            <Button
                                onClick={() => copyToClipboard(generatedEmail)}
                                disabled={loadingEmail || loadingSubject}
                            >
                                {t('aiEmailGenerator.form.label.copyEmailButton') || ''}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
