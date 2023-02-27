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
import { CompanyProvider, useCompany } from 'src/hooks/use-company';
import {
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    InboxArrowDownIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { hasCustomError } from 'src/utils/errors';
import { usageErrors } from 'src/errors/usages';
import { isMissing } from 'src/utils/utils';

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
        if (!profile?.id || !company?.id) {
            throw new Error('User or company not found');
        }
        const body: AIEmailSubjectGeneratorPostBody = {
            brandName,
            influencerName,
            productName,
            productDescription,
            user_id: profile.id,
            company_id: company.id,
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
    }, [brandName, influencerName, productName, productDescription, profile?.id, company?.id]);

    const generateEmail = useCallback(async () => {
        setLoadingEmail(true);
        const body: AIEmailGeneratorPostBody = {
            brandName,
            influencerName,
            productName,
            productDescription,
            instructions,
            senderName,
            user_id: profile?.id || '',
            company_id: company?.id || '',
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
    }, [
        brandName,
        influencerName,
        productName,
        productDescription,
        instructions,
        senderName,
        profile?.id,
        company?.id,
    ]);

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
            resetFields();
            if (hasCustomError(e, usageErrors)) {
                toast.error(t(e.message));
            } else {
                toast.error(t('aiEmailGenerator.index.status.requestError') || '');
            }
        }
    };

    const resetFields = () => {
        setGeneratedEmail('');
        setGeneratedSubject('');
        setLoadingEmail(false);
        setLoadingSubject(false);
    };

    const subjectLineRequiredMissing = isMissing(
        brandName,
        influencerName,
        productName,
        productDescription,
        profile?.id,
        company?.id,
    );
    const emailRequiredMissing = subjectLineRequiredMissing || !senderName;

    return (
        <div className="flex h-full w-full flex-col items-center p-6">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-2xl font-bold">
                    {t('aiEmailGenerator.index.title') || ''}
                </h1>
                <p className="mb-4 text-sm">{t('aiEmailGenerator.index.description') || ''}</p>
            </div>

            <div className="mt-10 flex w-full flex-col items-center justify-center gap-10 lg:h-full lg:flex-row lg:items-start">
                <form className="flex h-full w-full flex-col items-center justify-start md:w-1/3">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
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
                        placeholder={t('aiEmailGenerator.form.placeholder.influencerName') || ''}
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

                    <div className="flex flex-row items-center gap-2">
                        <Button
                            disabled={loadingEmail || loadingSubject || emailRequiredMissing}
                            type="submit"
                            onClick={(e) => handleSubmit(e, 'both')}
                            className="flex items-center gap-2"
                        >
                            <InboxArrowDownIcon className="mr-2 h-5 w-5" />
                            {loadingEmail
                                ? t('aiEmailGenerator.index.status.loading')
                                : t('aiEmailGenerator.index.generateEmail') || ''}
                        </Button>
                    </div>
                </form>

                <div
                    className={`${
                        generatedEmail.length < 1 || generatedSubject.length < 1
                            ? 'hidden opacity-0'
                            : 'opacity-100'
                    } mb-10 flex h-full w-full max-w-xl flex-col items-center justify-start gap-5 transition-all duration-300 md:w-2/3`}
                >
                    <div className="flex w-full flex-col items-center justify-center">
                        <InputTextArea
                            label={t('aiEmailGenerator.form.label.subjectLine') || ''}
                            value={generatedSubject}
                            readOnly
                            rows={4}
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
                                disabled={
                                    loadingEmail || loadingSubject || subjectLineRequiredMissing
                                }
                            >
                                <ArrowPathIcon className="w-4" />
                                {t('aiEmailGenerator.form.label.regenerateSubject') || ''}
                            </Button>
                        </div>
                    </div>

                    <div className="flex h-full w-full flex-col items-center justify-center ">
                        <label className="flex h-full w-full flex-col text-xs text-gray-500">
                            <div className="font-bold">
                                {t('aiEmailGenerator.form.label.generatedEmail') || ''}
                            </div>
                            <textarea
                                className="my-2 block h-full w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                value={generatedEmail}
                                readOnly
                                rows={18}
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
                                disabled={loadingEmail || loadingSubject || emailRequiredMissing}
                            >
                                <ArrowPathIcon className="w-4" />
                                {t('aiEmailGenerator.form.label.regenerateEmail') || ''}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIImageGeneratorPage = () => (
    <Layout>
        <CompanyProvider>
            <AIImageGenerator />
        </CompanyProvider>
    </Layout>
);

export default AIImageGeneratorPage;
