/* eslint-disable no-console */
import { Layout } from 'src/components/layout';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, FieldErrorsImpl, Control, FieldValues } from 'react-hook-form';
import FormWrapper from 'src/components/common/Form/FormWrapper/FormWrapper';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// import dateFormat from 'src/utils//dateFormat';
import MediaUploader from 'src/components/campaigns/MediaUploader';
import CurrencyInput from 'src/components/campaigns/CurrencyInput';
import toast from 'react-hot-toast';
import {
    MultiSelect,
    DatePicker,
    Checkbox,
    TextInput,
    TextareaInput as TextArea,
} from 'src/components/ui';
import { Question, questions, TimelineQuestion } from 'src/components/campaigns/helper';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useCallback } from 'react';
import { Spinner } from 'src/components/icons';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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
                router.push(`/campaigns/${encodeURIComponent(result.id)}`);
            } catch (error: any) {
                clientLogger(error, 'error');
                toast(error.message || t('campaigns.oopsSomethingWrong'));
                setSubmitting(false);
            }
        },
        [createCampaign, media, router, t, uploadFiles],
    );

    const updateHandler = useCallback(
        async (campaignWithCompanyCreators: CampaignWithCompanyCreators | null) => {
            if (!campaignWithCompanyCreators) return null;
            const {
                campaign_creators: _unused1,
                companies: _unused2,
                ...campaign
            } = campaignWithCompanyCreators;
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
            {isAddMode ? t('campaigns.form.createCampaign') : t('campaigns.form.editCampaign')}
        </button>
    ) : (
        <div className="btn btn-primary ml-2">
            <Spinner className="w-5 h-5 fill-primary-600 text-white" />
        </div>
    );

    return (
        <Layout>
            <div className="max-w-5xl container mx-auto p-6">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        {questions.map((q) => {
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
                                            // isRequired
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

                        <div className="buttons flex justify-end border-t border-gray-100 pt-6 mt-8">
                            <div onClick={goBack} className="btn btn-secondary ">
                                {t('campaigns.form.cancel')}
                            </div>
                            {renderButton}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Layout>
    );
}
