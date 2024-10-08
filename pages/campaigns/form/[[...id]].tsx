/* eslint-disable no-console */
import { Layout } from 'src/components/layout';
import { useTranslation } from 'react-i18next';
import type { FieldErrorsImpl, Control, FieldValues } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import FormWrapper from 'src/components/common/Form/FormWrapper/FormWrapper';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// import dateFormat from 'src/utils//dateFormat';
import MediaUploader from 'src/components/campaigns/MediaUploader';
import CurrencyInput from 'src/components/campaigns/CurrencyInput';
import toast from 'react-hot-toast';
import { MultiSelect, DatePicker, Checkbox, TextInput, TextareaInput as TextArea } from 'src/components/ui';
import type { Question, TimelineQuestion } from 'src/components/campaigns/helper';
import { questions } from 'src/components/campaigns/helper';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useCallback } from 'react';
import { Spinner } from 'src/components/icons';
import { clientLogger } from 'src/utils/logger-client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CampaignDB } from 'src/utils/api/db';
import { Modal } from 'src/components/modal';
import { CAMPAIGN_FORM } from 'src/utils/rudderstack/event-names';

const TimelineInput = ({
    q,
    errors,
    control,
}: {
    q: Question;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    control: Control<FieldValues>;
}) => {
    const { t } = useTranslation();

    const timeline = q as unknown as TimelineQuestion;
    return (
        <div className="flex flex-col">
            <DatePicker
                fieldName={timeline.fieldName_start}
                errors={errors}
                control={control}
                label={t(timeline.label_start)}
                isRequired={q.isRequired}
            />
            <DatePicker
                fieldName={timeline.fieldName_end}
                errors={errors}
                control={control}
                label={t(timeline.label_end)}
                isRequired={q.isRequired}
            />
        </div>
    );
};

// interface ExistingFile {
//     name: string; // use to delete
//     url: string; // use to display
// }

export default function CampaignForm() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const { trackEvent } = useRudderstack();
    const [submitting, setSubmitting] = useState(false);
    const [media, setMedia] = useState<File[]>([]);
    // only used in edit existing campaign mode.
    const [previousMedia, setPreviousMedia] = useState<object[]>([]);
    const [purgedMedia, setPurgedMedia] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm();
    const methods = useForm();
    const campaignId = router.query.id?.[0];
    const { createCampaign, updateCampaign, campaign } = useCampaigns({ campaignId });
    const { t } = useTranslation();
    const isAddMode = !router.query.id;
    const goBack = () => router.back();

    const uploadFiles = useCallback(
        async (files: File[], campaignId: string) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file?.name) continue;
                const filePath = `campaigns/${campaignId}/${file.name}`;
                await supabase.storage
                    .from('images')
                    .upload(filePath, file)
                    .catch((error) => clientLogger(error, 'error'));
            }
        },
        [supabase],
    );

    const deleteFiles = useCallback(
        async (files: File[], campaignId: string) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file?.name) continue;
                const filePath = `campaigns/${campaignId}/${file.name}`;
                await supabase.storage
                    .from('images')
                    .remove([filePath])
                    .catch((error) => clientLogger(error, 'error'));
            }
        },
        [supabase],
    );

    const createHandler = useCallback(
        async (data: any) => {
            setSubmitting(true);
            try {
                const result = await createCampaign(data);
                if (!result.id) throw new Error('No campaign id returned');
                if (media.length > 0) {
                    await uploadFiles(media, result.id);
                }
                toast(t('campaigns.form.successCreateMsg'));
                setSubmitting(false);
                trackEvent(CAMPAIGN_FORM('create new campaign'));
                router.push(`/campaigns/${encodeURIComponent(result.id)}`);
            } catch (error: any) {
                clientLogger(error, 'error');
                toast(error.message || t('campaigns.oopsSomethingWrong'));
                setSubmitting(false);
            }
        },
        [trackEvent, createCampaign, media, router, t, uploadFiles],
    );

    const updateHandler = useCallback(
        async (campaign: CampaignDB | null) => {
            if (!campaign) return null;
            setSubmitting(true);
            try {
                const result = await updateCampaign(campaign);
                if (!result.id) throw new Error('No campaign id returned');
                if (campaignId && media.length > 0) {
                    await uploadFiles(media, campaignId);
                }
                if (campaignId && purgedMedia.length > 0) {
                    await deleteFiles(purgedMedia, campaignId);
                }
                toast(t('campaigns.form.successUpdateMsg'));
                setSubmitting(false);
                router.push(`/campaigns/${encodeURIComponent(result.id)}`);
            } catch (error: any) {
                clientLogger(error, 'error');
                toast(error.message || t('campaigns.oopsSomethingWrong'));
                setSubmitting(false);
            }
        },
        [updateCampaign, campaignId, media, purgedMedia, t, router, uploadFiles, deleteFiles],
    );

    const onSubmit = useCallback(
        async (formData: any) => {
            formData = { ...formData, media, purge_media: [...purgedMedia] };

            if (isAddMode) {
                createHandler(formData);
            } else {
                await updateHandler(formData);
            }
        },
        [media, purgedMedia, isAddMode, createHandler, updateHandler],
    );

    useEffect(() => {
        const getFilePath = (filename: string) => {
            const {
                data: { publicUrl },
            } = supabase.storage.from('images').getPublicUrl(`campaigns/${campaignId}/${filename}`);
            return publicUrl;
        };

        const getFiles = async () => {
            const { data } = await supabase.storage.from('images').list(`campaigns/${campaignId}`, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

            const previousMediaFormatted = data?.map((file) => ({
                url: `${getFilePath(file.name)}`,
                name: file.name,
            }));

            if (previousMediaFormatted) {
                setPreviousMedia(previousMediaFormatted);
            }
        };

        if (campaignId) {
            getFiles();
        }
    }, [campaignId, supabase]);

    useEffect(() => {
        if (campaign) {
            reset(campaign);
        }
    }, [campaign, reset]);

    const renderButton = !submitting ? (
        <button type="submit" className="btn btn-primary ml-2">
            {isAddMode ? t('campaigns.form.createCampaign') : t('campaigns.form.saveCampaign')}
        </button>
    ) : (
        <div className="btn btn-primary ml-2">
            <Spinner className="h-5 w-5 fill-primary-600 text-white" />
        </div>
    );
    const filterQuestionsForNewCampaignMode = (questions: Question[]) => {
        if (isAddMode) {
            return questions.filter((q) => q.fieldName === 'name' || q.fieldName === 'media_gallery');
        }
        return questions;
    };

    return (
        <Layout>
            <div className="container mx-auto max-w-5xl p-6">
                <Modal visible={true} onClose={() => router.back()} maxWidth={`max-w-${isAddMode ? 'xl' : '3xl'}`}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                            {filterQuestionsForNewCampaignMode(questions).map((q) => {
                                return (
                                    <FormWrapper
                                        key={q.fieldName}
                                        isRequired={q.isRequired}
                                        title={t(q.title)}
                                        desc={t(q.desc)}
                                    >
                                        {q.type === 'textInput' && (
                                            <TextInput
                                                fieldName={q.fieldName}
                                                register={register}
                                                errors={errors}
                                                isRequired={q.isRequired}
                                            />
                                        )}
                                        {q.type === 'textArea' && (
                                            <TextArea
                                                fieldName={q.fieldName}
                                                register={register}
                                                errors={errors}
                                                isRequired={q.isRequired}
                                                placeHolder={q.placeholder}
                                            />
                                        )}
                                        {q.type === 'media' && (
                                            <MediaUploader
                                                media={media}
                                                setMedia={setMedia}
                                                previousMedia={previousMedia}
                                                setPreviousMedia={setPreviousMedia}
                                                setPurgedMedia={setPurgedMedia}
                                            />
                                        )}

                                        {q.type === 'multiSelect' && (
                                            <MultiSelect
                                                fieldName={q.fieldName}
                                                errors={errors}
                                                isRequired
                                                control={control}
                                                options={q.options || []}
                                                placeholder={t(q.placeholder ?? '') || ''}
                                                defaultValue={undefined}
                                                setValue={setValue}
                                            />
                                        )}
                                        {q.type === 'currencyInput' && (
                                            <CurrencyInput
                                                register={register}
                                                errors={errors}
                                                isRequired
                                                control={control}
                                                setValue={setValue}
                                                defaultValue="USD"
                                            />
                                        )}
                                        {q.type === 'timeline' && (
                                            <TimelineInput q={q} errors={errors} control={control} />
                                        )}
                                        {q.type === 'checkbox' && (
                                            <Checkbox
                                                fieldName={q.fieldName}
                                                register={register}
                                                errors={errors}
                                                isRequired
                                                options={q.options || []}
                                            />
                                        )}
                                    </FormWrapper>
                                );
                            })}

                            <div className="buttons mt-8 flex justify-end border-t border-gray-100 pt-6">
                                <div onClick={goBack} className="btn btn-secondary ">
                                    {t('campaigns.form.cancel')}
                                </div>
                                {renderButton}
                            </div>
                        </form>
                    </FormProvider>
                </Modal>
            </div>
        </Layout>
    );
}
