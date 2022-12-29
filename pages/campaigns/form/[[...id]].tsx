/* eslint-disable no-console */
import { Layout } from 'src/modules/layout';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, FieldErrorsImpl, Control, FieldValues } from 'react-hook-form';
import FormWrapper from 'src/components/common/Form/FormWrapper/FormWrapper';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// import dateFormat from 'src/utils//dateFormat';
import MediaUploader from 'src/components/campaigns/MediaUploader';
import CurrencyInput from 'src/components/campaigns/CurrencyInput';
import toast from 'react-hot-toast';
import { handleError } from 'src/utils/utils.js';
import {
    MultiSelect,
    DatePicker,
    Checkbox,
    TextInput,
    TextareaInput as TextArea
} from 'src/components/ui';
import { Question, questions, TimelineQuestion } from 'src/components/campaigns/helper';
import LoaderWhite from 'src/components/icons/LoaderWhite';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useCallback } from 'react';
import { supabase } from 'src/utils/supabase-client';

const TimelineInput = ({
    q,
    errors,
    control
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
    // TODO: if existing campaign, fetch list of files
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [media, setMedia] = useState<File[]>([]);
    // only used in edit existing campaign mode.
    const [prevMedia, setPrevMedia] = useState<string[]>([]);
    const [purgedMedia, setPurgedMedia] = useState<File[]>([]);
    const [mediaPaths, setMediaPaths] = useState<string[]>([]);
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }
    } = useForm();
    const methods = useForm();
    const campaignId = router.query.id?.[0];
    const { createCampaign, updateCampaign, campaign } = useCampaigns({ campaignId });
    const { t } = useTranslation();
    const isAddMode = !router.query.id;
    const goBack = () => router.back();

    const createHandler = useCallback(
        async (data: any) => {
            setSubmitting(true);
            try {
                const result = await createCampaign(data);
                console.log({ result, media });
                if (media.length > 0) {
                    await uploadFiles(media, result.id);
                }

                toast(t('campaigns.form.successCreateMsg'));
                setSubmitting(false);
                // router.push(`/campaigns/${encodeURIComponent(result.id)}`);
            } catch (error) {
                toast(handleError(error));
                setSubmitting(false);
            }
        },
        [createCampaign, t, media]
    );

    const updateHandler = useCallback(
        async (data: any) => {
            setSubmitting(true);
            try {
                await updateCampaign(data);
                toast(t('campaigns.form.successCreateMsg'));
                setSubmitting(false);
                if (campaignId && media.length > 0) {
                    await uploadFiles(media, campaignId);
                }
                if (purgedMedia.length > 0) {
                    await deleteFiles(purgedMedia as any);
                }
                // router.push(`/campaigns/${encodeURIComponent(data.id)}`);
            } catch (error) {
                toast(handleError(error));
                setSubmitting(false);
            }
        },
        [updateCampaign, t, campaignId, media, purgedMedia]
    );

    const uploadFiles = async (files: File[], campaignId: string) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = `campaigns/${campaignId}/${file.name}`;
            if (!file) continue;
            await supabase.storage
                .from('images')
                .upload(filePath, file)
                .then((res) => {
                    mediaPaths.push(res.data?.Key as string);
                    console.log(mediaPaths);
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error);
                });
        }
    };

    const deleteFiles = async (files: string[]) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;
            // const { data, error } = await supabase.storage
            //     .from('images')
            //     .remove('campaigns/' + file.name);

            // if (data) {
            //     // eslint-disable-next-line no-console
            //     console.log({ data });
            // } else if (error) {
            //     // eslint-disable-next-line no-console
            //     console.log({ error });
            // }
        }
    };

    const onSubmit = useCallback(
        async (formData: any) => {
            formData = { ...formData, media, purge_media: [...purgedMedia], mediaPaths };
            console.log(formData);

            if (isAddMode) {
                createHandler(formData);
            } else {
                await updateHandler(formData);
            }
        },
        [media, purgedMedia, prevMedia, isAddMode, createHandler, updateHandler]
    );

    useEffect(() => {
        const getFiles = async () => {
            // list files
            const { data, error } = await supabase.storage
                .from('images')
                .list(`campaigns/${campaignId}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });
            console.log({ data, error }, prevMedia);
        };

        if (campaignId) {
            getFiles();
        }
    }, [campaignId, mediaPaths]);

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
            <LoaderWhite className="w-5 h-5" />
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
                                            prevMedia={prevMedia}
                                            setPrevMedia={setPrevMedia}
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
