import { Layout } from 'src/modules/layout';
import { useTranslation } from 'react-i18next';
import {
    useForm,
    FormProvider,
    FieldErrorsImpl,
    Control,
    FieldValues,
    ArrayPath,
    DeepPartial,
    FieldArray,
    FieldError,
    FormState,
    Path,
    PathValue,
    UseFormRegisterReturn,
    Validate,
    ValidationRule
} from 'react-hook-form';
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

export default function CampaignForm() {
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [media, setMedia] = useState([]);
    const [prevMedia, setPrevMedia] = useState([]);
    const [purgedMedia, setPurgedMedia] = useState([]);
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }
    } = useForm();
    const methods = useForm();
    const { createCampaign, updateCampaign, campaign } = useCampaigns({
        campaignId: router.query.id?.[0]
    });
    const { t } = useTranslation();
    const isAddMode = !router.query.id;
    const goBack = () => router.back();

    const createHandler = useCallback(
        async (data: any) => {
            setSubmitting(true);
            try {
                await createCampaign(data);
                toast(t('campaigns.form.successCreateMsg'));
                setSubmitting(false);
                router.push(`/campaigns/${encodeURIComponent(data.id)}`);
            } catch (error) {
                toast(handleError(error));
                setSubmitting(false);
            }
        },
        [createCampaign, router, t]
    );

    const updateHandler = useCallback(
        async (data: any) => {
            setSubmitting(true);
            try {
                await updateCampaign(data);
                toast(t('campaigns.form.successCreateMsg'));
                setSubmitting(false);
                router.push(`/campaigns/${encodeURIComponent(data.id)}`);
            } catch (error) {
                toast(handleError(error));
                setSubmitting(false);
            }
        },
        [updateCampaign, router, t]
    );

    const onSubmit = useCallback(
        async (formData: any) => {
            return isAddMode ? createHandler(formData) : updateHandler(formData);
        },
        [isAddMode, createHandler, updateHandler]
    );

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
                                            label={undefined}
                                            type={undefined}
                                            placeHolder={undefined}
                                            maxLength={undefined}
                                            minLength={undefined}
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
                                            options={q.options}
                                            placeholder={t(q.placeholder ?? '')}
                                            defaultValue={undefined}
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
                                            options={q.options}
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
