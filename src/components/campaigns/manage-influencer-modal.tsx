import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { InfluencerOutreachStatus, SocialMediaPlatform } from 'types';
import { ArrowRightOnRectangle, Trashcan } from '../icons';
import { SocialMediaIcon } from '../common/social-media-icon';

import { useCallback } from 'react';
import { useState } from 'react';
import { Button } from '../button';
import { CreatorContacts } from './creator-contacts';

const statusOptions: { label: string; value: InfluencerOutreachStatus }[] = [
    { label: 'toContact', value: 'to contact' },
    { label: 'contacted', value: 'contacted' },
    { label: 'inProgress', value: 'in progress' },
    { label: 'confirmed', value: 'confirmed' },
    { label: 'posted', value: 'posted' },
    { label: 'rejected', value: 'rejected' },
    { label: 'ignored', value: 'ignored' },
];

export interface ManageInfluencerModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
    openMoveInfluencerModal: (creator: CampaignCreatorDB) => void;
    openNotes: (creator: CampaignCreatorDB) => void;
    deleteCampaignCreator: (creator: CampaignCreatorDB) => Promise<void>;
    updateCampaignCreator: (creator: CampaignCreatorDB) => Promise<void>;
}

const validateNumberInput = (fee: string) => {
    // must be a number
    if (!fee) {
        return '';
    }
    if (isNaN(Number(fee))) {
        return 'Must be a number';
    }
};

const validateDate = (date: string) => {
    if (!date) {
        return '';
    }
    if (isNaN(Date.parse(date))) {
        return 'Must be a valid date';
    }
};

const inputClass =
    'block w-full max-w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-gray-300 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-xs sm:text-xs';

const FormSection = ({ creator: initialCreator, onClose, updateCampaignCreator }: ManageInfluencerModalProps) => {
    const { t } = useTranslation();
    const [creator, setCreator] = useState(initialCreator);

    const [showContactInfo, setShowContactInfo] = useState(false);

    const handleUpdateCampaignInfluencer = useCallback(async () => {
        await updateCampaignCreator(creator);
    }, [creator, updateCampaignCreator]);

    const handleStatusSelect = (status: InfluencerOutreachStatus) => {
        setCreator({ ...creator, status });
    };

    const [influencerFee, setInfluencerFee] = useState(creator.rate_cents?.toString());
    const [paymentDetails, setPaymentDetails] = useState(creator.payment_details || '');
    const [paymentAmount, setPaymentAmount] = useState(creator.paid_amount_cents?.toString());
    const [publicationDate, setPublicationDate] = useState(creator.publication_date?.toString() || '');
    const [nextPoint, setNextPoint] = useState(creator.next_step?.toString() || '');
    // const [sales, setSales] = useState(creator.sales?.toString() || '');
    const [address, setAddress] = useState(creator.address || '');
    const [sampleStatus, setSampleStatus] = useState(creator.sample_status || '');

    const submitDisabled =
        [influencerFee, paymentAmount].some((field) => validateNumberInput(field)) ||
        [publicationDate].some((field) => validateDate(field));

    return (
        <form
            className="flex w-full flex-col gap-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdateCampaignInfluencer();
            }}
        >
            <div className="flex w-full flex-wrap gap-y-3">
                <div className="flex w-full flex-col gap-y-3 px-3 sm:w-1/2">
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="show-contact-info" className="text-sm font-bold">
                            {t('campaigns.manageInfluencer.contactInfo')}
                        </label>
                        {showContactInfo ? (
                            <CreatorContacts {...creator} />
                        ) : (
                            <Button
                                id="show-contact-info"
                                variant="secondary"
                                className="w-fit"
                                onClick={() => setShowContactInfo(true)}
                            >
                                {t('campaigns.show.viewContactInfo')}
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="influencer-fee-input" className="text-sm font-bold">
                            {`${t('campaigns.manageInfluencer.influencerFee')} (${creator.paid_amount_currency})`}
                        </label>
                        <input
                            id="influencer-fee-input"
                            className={inputClass}
                            onChange={(e) => setInfluencerFee(e.target.value)}
                            value={influencerFee}
                        />
                        <p className="text-xs text-red-400">{validateNumberInput(influencerFee)}</p>
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="influencer-payment-info-input" className="text-sm font-bold">
                            {t('campaigns.show.paymentInformation')}
                        </label>
                        <input
                            id="influencer-payment-info-input"
                            className={inputClass}
                            onChange={(e) => setPaymentDetails(e.target.value)}
                            value={paymentDetails}
                        />
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="influencer-paid-amount-input" className="text-sm font-bold">
                            {`${t('campaigns.show.paidAmount')} (${creator.paid_amount_currency})`}
                        </label>
                        <input
                            id="influencer-paid-amount-input"
                            className={inputClass}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            value={paymentAmount}
                        />
                        <p className="text-xs text-red-400">{validateNumberInput(paymentAmount)}</p>
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="influencer-publication-date-input" className="text-sm font-bold">
                            {t('campaigns.show.publicationDate')}
                        </label>
                        <input
                            id="influencer-publication-date-input"
                            className={inputClass}
                            onChange={(e) => setPublicationDate(e.target.value)}
                            value={publicationDate}
                            type="date"
                        />
                        <p className="text-xs text-red-400">{validateDate(publicationDate)}</p>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-y-3 px-3 sm:w-1/2">
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="status-dropdown" className="text-sm font-bold">
                            {t('campaigns.show.creatorStatus')}
                        </label>
                        <select
                            id="status-dropdown"
                            data-testid="status-dropdown"
                            onChange={(e) => handleStatusSelect(e.target.value as InfluencerOutreachStatus)}
                            value={creator.status || ''}
                            className="w-fit cursor-pointer appearance-none rounded-md border border-gray-200 bg-primary-50 px-4 py-2 text-center text-sm font-semibold text-primary-500 outline-none duration-300 hover:bg-primary-100"
                        >
                            {statusOptions.map((tab, index) => (
                                <option value={tab.value} key={index}>
                                    {t(`campaigns.show.activities.outreach.${tab.label}`)}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="influencer-next-action-input" className="text-sm font-bold">
                                {t('campaigns.show.nextPoint')}
                            </label>
                            <input
                                id="influencer-next-action-input"
                                className={inputClass}
                                onChange={(e) => setNextPoint(e.target.value)}
                                value={nextPoint}
                            />
                        </div>
                        {/* TODO: Sales */}
                        {/* <div className="flex flex-col gap-y-3">
                            <label htmlFor="influencer-sales-input" className="text-sm font-bold">
                                {t('campaigns.show.nextPoint')}
                            </label>
                            <input
                                id="influencer-sales-input"
                                className={inputClass}
                                onChange={(e) => setSales(e.target.value)}
                                value={sales}
                            />
                        </div> */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="influencer-address-input" className="text-sm font-bold">
                                {t('campaigns.show.influencerAddress')}
                            </label>
                            <input
                                id="influencer-address-input"
                                className={inputClass}
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </div>
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="influencer-sample-status-input" className="text-sm font-bold">
                                {t('campaigns.show.sampleStatus')}
                            </label>
                            <input
                                id="influencer-sample-status-input"
                                className={inputClass}
                                onChange={(e) => setSampleStatus(e.target.value)}
                                value={sampleStatus}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-auto flex gap-x-3">
                <Button
                    variant="secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        onClose(false);
                    }}
                >
                    {t('campaigns.manageInfluencer.cancel')}
                </Button>
                <Button disabled={submitDisabled} type="submit">
                    {t('campaigns.manageInfluencer.save')}
                </Button>
            </div>
        </form>
    );
};

const HeaderSection = ({ creator }: { creator: CampaignCreatorDB }) => {
    const { t } = useTranslation();
    const handle = creator.username || creator.fullname || '';

    return (
        <div className="mb-10 flex justify-between">
            <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.manageInfluencer.title')}</h2>
            <div className="flex items-center">
                <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                    <img className="h-10 w-10 rounded-full" src={imgProxy(creator.avatar_url)} alt="" />
                    <div className="absolute bottom-0 right-0 ">
                        <SocialMediaIcon
                            platform={creator.platform as SocialMediaPlatform}
                            width={16}
                            height={16}
                            className="opacity-80"
                        />
                    </div>
                </div>

                <Link href={creator.link_url || ''} target="_blank">
                    <div className="ml-4">
                        <div className="truncate text-xs font-medium text-gray-900">{creator.fullname}</div>
                        <div className="inline-block truncate text-xs text-primary-500">@{handle}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const smallButtonClass =
    'rounded-md border border-gray-200 bg-gray-100 p-1 text-xs font-medium text-gray-600 hover:bg-gray-200';

const SmallButtonsSection = ({
    creator,
    openNotes,
    openMoveInfluencerModal,
    deleteCampaignCreator,
}: ManageInfluencerModalProps) => {
    const { t } = useTranslation();

    return (
        <div className="pb-5">
            <div className="flex justify-end gap-x-2">
                <button
                    data-testid="show-influencer-notes"
                    onClick={() => openNotes(creator)}
                    className={smallButtonClass}
                >
                    {t('campaigns.show.notes')}
                </button>

                <button
                    data-testid="show-move-influencer"
                    onClick={() => openMoveInfluencerModal(creator)}
                    className={smallButtonClass}
                >
                    <ArrowRightOnRectangle className="h-4 w-4 stroke-tertiary-600 " />
                </button>

                <button
                    data-testid="delete-influencer"
                    onClick={() => deleteCampaignCreator(creator)}
                    className={smallButtonClass}
                >
                    <Trashcan className="h-4 w-4 fill-tertiary-600" />
                </button>
            </div>
        </div>
    );
};

export const ManageInfluencerModal = (props: ManageInfluencerModalProps) => {
    return (
        <Modal {...props} maxWidth="max-w-[900px]">
            <>
                <HeaderSection {...props} />
                <SmallButtonsSection {...props} />
                <FormSection {...props} />
            </>
        </Modal>
    );
};
