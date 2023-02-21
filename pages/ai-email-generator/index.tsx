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
import { Layout } from 'src/components/layout';
import { toast } from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger';
import {
    AIEmailSubjectGeneratorPostBody,
    AIEmailSubjectGeneratorPostResult,
} from 'pages/api/ai-generate/subject';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import {
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    InboxArrowDownIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const MAX_CHARACTER_LENGTH = 600;

const removeLeadingSpace = (text: string) => {
    return text.replace(/^\s+/, '');
};

const AIImageGenerator = () => {
    const { t } = useTranslation();

    const { profile } = useUser();
    const { company } = useCompany();

    const [brandName, setBrandName] = useState('');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [generatedSubject, setGeneratedSubject] = useState('');
    const [loadingSubject, setLoadingSubject] = useState(false);

    useEffect(() => {
        setBrandName(company?.name || '');
        setSenderName(profile?.first_name || '');
    }, [profile, company]);

    const generateSubject = useCallback(async () => {
        setLoadingSubject(true);
        const body: AIEmailSubjectGeneratorPostBody = {
            brandName,
            influencerName,
            productName,
            productDescription,
        };
        const res = await nextFetch<AIEmailSubjectGeneratorPostResult>('ai-generate/subject', {
            method: 'post',
            body,
        });

        if (!res.text) {
            throw new Error('Email generation failed');
        }

        setGeneratedSubject(removeLeadingSpace(res.text));
        setLoadingSubject(false);

        return res;
    }, [brandName, influencerName, productName, productDescription]);

    const generateEmail = useCallback(async () => {
        setLoadingEmail(true);
        const body: AIEmailGeneratorPostBody = {
            brandName,
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
                body,
            },
        );

        if (!res.text) {
            throw new Error('Email generation failed');
        }

        setGeneratedEmail(removeLeadingSpace(res.text));
        setLoadingEmail(false);

        return res;
    }, [brandName, influencerName, productName, productDescription, instructions, senderName]);

    const handleSubmit = async (e: any, type: 'subject' | 'email' | 'both') => {
        e.preventDefault();
        const loadingToast = toast.loading(t('aiEmailGenerator.index.status.generating') || '');
        try {
            if (type === 'email') {
                await generateEmail();
            } else if (type === 'subject') {
                await generateSubject();
            } else {
                await generateEmail();
                await generateSubject();
            }
            toast.dismiss(loadingToast);
            toast.success(t('aiEmailGenerator.index.status.generatedSuccessfully') || '');
        } catch (e: any) {
            clientLogger(e, 'error');
            toast.dismiss(loadingToast);
            toast.error(t('aiEmailGenerator.index.status.requestError') || '');
            resetFields();
        }
    };

    const resetFields = () => {
        setGeneratedEmail('');
        setGeneratedSubject('');
        setLoadingEmail(false);
        setLoadingSubject(false);
    };

    return (
        <Layout>
            <div className="flex flex-col items-center p-6 w-full h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t('aiEmailGenerator.index.title') || ''}
                    </h1>
                    <p className="text-sm mb-4">{t('aiEmailGenerator.index.description') || ''}</p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start items-center justify-center gap-10 mt-10 w-full lg:h-full">
                    <form className="flex flex-col h-full items-center justify-start w-full md:w-1/3">
                        <p className="text-sm mb-2 text-gray-500 font-semibold">
                            {t('aiEmailGenerator.index.information')}
                        </p>
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
                                className="flex items-center gap-2"
                            >
                                <InboxArrowDownIcon className="w-5 h-5 mr-2" />
                                {loadingEmail
                                    ? t('aiEmailGenerator.index.status.loading')
                                    : t('aiEmailGenerator.index.generateEmail') || ''}
                            </Button>
                        </div>
                    </form>

                    <div
                        className={`${
                            generatedEmail.length < 1 || generatedSubject.length < 1
                                ? 'opacity-0 hidden'
                                : 'opacity-100'
                        } flex transition-all duration-300 max-w-xl mb-10 flex-col items-center justify-start w-full md:w-2/3 gap-5 h-full`}
                    >
                        <div className="w-full flex flex-col items-center justify-center">
                            <InputTextArea
                                label={t('aiEmailGenerator.form.label.subjectLine') || ''}
                                value={generatedSubject}
                                onChange={() => {
                                    return;
                                }}
                                rows={3}
                            />

                            <div className="flex flex-col gap-2 md:flex-row md:gap-5">
                                <Button
                                    onClick={() => copyToClipboard(generatedSubject)}
                                    disabled={loadingEmail || loadingSubject}
                                    className="flex items-center gap-2"
                                >
                                    <ClipboardDocumentCheckIcon className="w-4" />
                                    {t('aiEmailGenerator.form.label.copySubjectButton') || ''}
                                </Button>

                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                    onClick={(e) => handleSubmit(e, 'subject')}
                                    disabled={loadingEmail || loadingSubject}
                                >
                                    <ArrowPathIcon className="w-4" />
                                    {t('aiEmailGenerator.form.label.regenerateSubject') || ''}
                                </Button>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-center items-center h-full ">
                            <label className="flex flex-col text-xs text-gray-500 h-full w-full">
                                <div className="font-bold">
                                    {t('aiEmailGenerator.form.label.generatedEmail') || ''}
                                </div>
                                <textarea
                                    className="ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2 h-full"
                                    value={generatedEmail}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </label>
                            <div className="flex flex-col gap-2 md:flex-row md:gap-5">
                                <Button
                                    onClick={() => copyToClipboard(generatedEmail)}
                                    className="flex items-center gap-2"
                                    disabled={loadingEmail || loadingSubject}
                                >
                                    <ClipboardDocumentCheckIcon className="w-4" />
                                    {t('aiEmailGenerator.form.label.copyEmailButton') || ''}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                    onClick={(e) => handleSubmit(e, 'email')}
                                    disabled={loadingEmail || loadingSubject}
                                >
                                    <ArrowPathIcon className="w-4" />
                                    {t('aiEmailGenerator.form.label.regenerateEmail') || ''}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
