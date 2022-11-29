/* eslint-disable no-unused-vars */
import { Layout } from 'src/modules/layout';
// import Dashboard from '@/components/hocs/Dashboard';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import FormWrapper from 'src/components/common/Form/FormWrapper/FormWrapper';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dateFormat from 'src/utils//dateFormat';
import MediaUploader from 'src/components/campaigns/MediaUploader';
import CurrencyInput from 'src/components/campaigns/CurrencyInput';
// import can from '@/libs/cancan/react-cancan';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import { handleError } from 'src/utils/utils.js';
import {
    MultiSelect,
    SingleSelect,
    DatePicker,
    Checkbox,
    TextInput,
    TextareaInput as TextArea
} from 'src/components/ui';
import { questions } from 'src/components/campaigns/helper';
import LoaderWhite from 'src/components/icons/LoaderWhite';
import { useCampaigns } from 'src/hooks/use-campaigns';

export default function CampaignForm() {
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
        watch,
        formState: { errors }
    } = useForm();
    const { createCampaign } = useCampaigns();

    const { t } = useTranslation();
    const router = useRouter();
    const { campaign } = router.query;
    const isAddMode = !campaign;

    const goBack = () => router.back();

    // const getCampaign = async () => {
    //     try {
    //         const res = await http.get(`/campaigns/${campaign}?hide_creator_details=true`);
    //         if (res.data.campaign.date_end_campaign)
    //             res.data.campaign.date_end_campaign = dateFormat(
    //                 res.data.campaign.date_end_campaign,
    //                 'isoDate'
    //             );
    //         if (res.data.campaign.date_start_campaign)
    //             res.data.campaign.date_start_campaign = dateFormat(
    //                 res.data.campaign.date_start_campaign,
    //                 'isoDate'
    //             );
    //         if (res.data.campaign.company_id) setValue('clients', res.data.campaign.company.id);
    //         setPrevMedia(res.data.campaign.media);
    //         delete res.data.campaign.media;
    //         reset(res.data.campaign);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const onSubmit = async (formData) => {
        // formData = { ...formData, media, purge_media: [...purgedMedia] };
        console.log(formData);
        // const data = new FormData();
        // delete formData.image_main;
        // data.append('[campaign]', JSON.stringify(formData));
        // if (formData.media) formData.media.forEach((k) => data.append('media[]', k));
        return isAddMode ? createHandler(formData) : updateCampaign(formData);
    };

    const createHandler = async (data) => {
        setSubmitting(true);
        try {
            await createCampaign(data);
            toast(t('campaigns.form.successCreateMsg'));
            // router.push(`/dashboard/campaigns/${res.data.campaign.slug}`);
        } catch (error) {
            toast(handleError(error));
            setSubmitting(false);
        }
    };

    const updateCampaign = async (data) => {
        // setSubmitting(true);
        // try {
        //     const res = await http.patch(`campaigns/${campaign}`, data);
        //     router.push(`/dashboard/campaigns/${res.data.campaign.slug}`);
        // } catch (error) {
        //     toast(handleError(error));
        //     setSubmitting(false);
        // }
    };

    const renderButton = !submitting ? (
        <button type="submit" className="btn btn-primary ml-2">
            {isAddMode ? t('campaigns.form.createCampaign') : t('campaigns.form.editCampaign')}
        </button>
    ) : (
        <div className="btn btn-primary ml-2">
            <LoaderWhite className="w-5 h-5" />
        </div>
    );

    // useEffect(() => {
    //     if (!isAddMode) getCampaign();
    // }, [isAddMode]);

    return (
        <Layout>
            <div className="max-w-5xl container mx-auto p-6">
                <FormProvider>
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
                                            placeholder={t(q.placeholder)}
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
                                        <div className="flex flex-col">
                                            <DatePicker
                                                fieldName={q.fieldName_start}
                                                errors={errors}
                                                control={control}
                                                label={t(q.label_start)}
                                            />
                                            <DatePicker
                                                fieldName={q.fieldName_end}
                                                errors={errors}
                                                control={control}
                                                label={t(q.label_end)}
                                            />
                                        </div>
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
