import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'shadcn/components/ui/input';
import { debounce } from 'src/utils/debounce';
import type { AddressesPutRequestBody } from 'pages/api/addresses';
import { doesObjectMatchUpdate } from 'src/utils/does-object-match-update';
import type { CheckboxDropdownItemData } from 'src/components/influencer-profile/components/checkbox-dropdown-item';
import { OutreachCollabStatusInput } from 'src/components/influencer-profile/components/outreach-collab-status-input';
import { CollabScheduledPostDateInput } from 'src/components/influencer-profile/components/collab-scheduled-post-date-input';
import { useSequenceInfluencer, useSequenceInfluencerAddress } from 'src/hooks/v2/use-sequence-influencer';
import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import type { AddressEntity } from 'src/backend/database/influencer/address-entity';
import type { Nullable } from 'types/nullable';
import type { UpdateSequenceInfluencerRequest } from 'pages/api/v2/sequence-influencers/[id]/request';
import type { FunnelStatusRequest } from 'pages/api/v2/threads/request';
import type { UpdateAddressRequest } from 'pages/api/v2/sequence-influencers/[id]/addresses/request';
import dayjs from 'dayjs';
import { useThread, useThreadStore } from 'src/hooks/v2/use-thread';
// TODO: https://linear.app/boostbot/issue/BB-232/notes-section
// import { OutreachNotesInput } from './components/outreach-notes-input';
// import { NotesListOverlayScreen } from './screens/notes-list-overlay';

export const COLLAB_STATUS_OPTIONS: CheckboxDropdownItemData[] = [
    {
        id: 'Negotiating',
        label: 'Negotiating',
        style: 'bg-yellow-100 text-yellow-500',
    },
    {
        id: 'Confirmed',
        label: 'Confirmed',
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'Shipped',
        label: 'Shipped',
        style: 'bg-orange-100 text-orange-500',
    },
    {
        id: 'Received',
        label: 'Received',
        style: 'bg-fuchsia-100 text-fuchsia-500',
    },
    {
        id: 'Content Approval',
        label: 'Content Approval',
        style: 'bg-cyan-100 text-cyan-500',
    },
    {
        id: 'Completed',
        label: 'Completed',
        style: 'bg-green-100 text-green-500',
    },
    {
        id: 'Posted',
        label: 'Posted',
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'Rejected',
        label: 'Rejected',
        style: 'bg-red-100 text-red-500',
    },
];

export interface ManageSectionProps {
    influencer: SequenceInfluencerEntity;
    address: AddressEntity;
}

const processStringAsNumber = (inputValue: string) => {
    const value = inputValue.trim();
    if (value === '') return undefined;
    const float = parseFloat(value);
    if (isNaN(float)) return undefined;
    return float;
};

export default function ProfileManage({ influencer: passedInfluencer, address: passedAddress }: ManageSectionProps) {
    const { t } = useTranslation();

    const [influencer, setInfluencer] = useState(passedInfluencer);
    const { selectedThread } = useThread();
    const { setThreadFunnelStatus } = useThreadStore((state) => ({
        setThreadFunnelStatus: state.setThreadFunnelStatus,
    }));
    useEffect(() => {
        setInfluencer(passedInfluencer);
    }, [passedInfluencer]);

    const [address, setAddress] = useState(passedAddress);
    useEffect(() => {
        setAddress(passedAddress);
    }, [passedAddress]);

    const { id, funnelStatus, rateAmount, commissionRate, affiliateLink, scheduledPostDate } = influencer || {};
    const { name, phoneNumber, addressLine1, city, state, postalCode, country, trackingCode } = address || {};

    const funnelStatusController = useRef<Nullable<AbortController>>(null);
    const rateAmountController = useRef<Nullable<AbortController>>(null);
    const commissionRateController = useRef<Nullable<AbortController>>(null);
    const affiliateLinkController = useRef<Nullable<AbortController>>(null);
    const scheduledPostDateController = useRef<Nullable<AbortController>>(null);
    const nameController = useRef<Nullable<AbortController>>(null);
    const phoneNumberController = useRef<Nullable<AbortController>>(null);
    const addressLine1Controller = useRef<Nullable<AbortController>>(null);
    const cityController = useRef<Nullable<AbortController>>(null);
    const stateController = useRef<Nullable<AbortController>>(null);
    const postalCodeController = useRef<Nullable<AbortController>>(null);
    const countryController = useRef<Nullable<AbortController>>(null);
    const trackingCodeController = useRef<Nullable<AbortController>>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const { updateSequenceInfluencer } = useSequenceInfluencer();

    const { updateSequenceInfluencerAddress } = useSequenceInfluencerAddress();
    const updateInfluencer = useCallback(
        async (body: UpdateSequenceInfluencerRequest, controller: MutableRefObject<Nullable<AbortController>>) => {
            controller.current = new AbortController();
            updateSequenceInfluencer(influencer.id, body, { signal: controller.current?.signal });
        },
        [updateSequenceInfluencer, influencer.id],
    );

    const updateAddress = useCallback(
        async (body: AddressesPutRequestBody, controller: MutableRefObject<Nullable<AbortController>>) => {
            controller.current = new AbortController();
            await updateSequenceInfluencerAddress(influencer.id, body, { signal: controller.current?.signal });
        },
        [influencer.id, updateSequenceInfluencerAddress],
    );

    const updateInfluencerDebounced = debounce(updateInfluencer, 2000);
    const updateAddressDebounced = debounce(updateAddress, 2000);

    const handleUpdateInfluencer = useCallback(
        async (
            update: Partial<UpdateSequenceInfluencerRequest>,
            controller: MutableRefObject<Nullable<AbortController>>,
            debounce = true,
        ) => {
            if (
                !influencer ||
                !update ||
                Object.keys(update).length === 0 ||
                // if no changes to the values in each of the keys, return
                doesObjectMatchUpdate(influencer, update)
            ) {
                return;
            }
            if (update.funnelStatus) {
                setThreadFunnelStatus(selectedThread?.id, update.funnelStatus);
            }
            const previous = { ...influencer };
            // optimistic update
            setInfluencer({
                ...previous,
                ...update,
                scheduledPostDate: update.scheduledPostDate
                    ? new Date(update.scheduledPostDate)
                    : previous.scheduledPostDate,
            });

            if (debounce) {
                await updateInfluencerDebounced({ id, ...update }, controller);
            } else {
                await updateInfluencer({ ...update }, controller);
            }
        },
        [influencer, id, updateInfluencerDebounced, updateInfluencer, setThreadFunnelStatus, selectedThread?.id],
    );

    const handleUpdateAddress = useCallback(
        async (
            update: Partial<UpdateAddressRequest>,
            controller: MutableRefObject<Nullable<AbortController>>,
            debounce = true,
        ) => {
            if (!address || !update || Object.keys(update).length === 0 || doesObjectMatchUpdate(address, update)) {
                return;
            }
            const previous = { ...address };
            // optimistic update
            setAddress({ ...previous, ...update });
            if (debounce) {
                await updateAddressDebounced({ id: address.id, ...update }, controller);
            } else {
                await updateAddress({ id: address.id, ...update }, controller);
            }
        },
        [address, updateAddressDebounced, updateAddress],
    );

    const fullAddress = `${addressLine1 || ''}, ${city || ''}, ${state || ''}, ${postalCode || ''}, ${country || ''}`;

    // TODO: https://linear.app/boostbot/issue/BB-232/notes-section
    // const [notesOverlayOpen, setNotesOverlayOpen] = useState(false);

    return (
        <>
            {/*     // TODO: https://linear.app/boostbot/issue/BB-232/notes-section
             */}
            {/* <NotesListOverlayScreen isOpen={notesOverlayOpen} onClose={() => setNotesOverlayOpen(false)} notes={[]} /> */}
            <div className="p-4 text-gray-600" id="creator-profile-quick-notes">
                <h2 className="font-semibold ">{t('profile.collab')}</h2>
                <hr className="mb-4 mt-1 border-gray-200" />

                <OutreachCollabStatusInput
                    label={t('profile.collabStatus') as string}
                    onUpdate={(items) => {
                        const selected = items.length > 0 ? items[0].id : funnelStatus;
                        if (selected === funnelStatus) return;
                        handleUpdateInfluencer(
                            { funnelStatus: selected as FunnelStatusRequest },
                            funnelStatusController,
                            false,
                        );
                    }}
                    options={COLLAB_STATUS_OPTIONS}
                    selected={[funnelStatus]}
                />
                {/*     // TODO: https://linear.app/boostbot/issue/BB-232/notes-section
                 */}
                {/* <OutreachNotesInput
                    label={t('profile.notes')}
                    placeholder={t('profile.notesPlaceholder') as string}
                    buttonText={t('profile.addNoteButton')}
                    // disabled={updating}
                    value={''}
                    // onUpdate={(value) => onUpdateNotes('notes', value)}
                    // onSave={handleSaveNotes}
                    onOpenList={() => setNotesOverlayOpen(true)}
                /> */}

                <h2 className="mt-10 font-semibold">
                    {t('profile.compAndDeliverables') || 'Compensation & Deliverables'}
                </h2>
                <hr className="mb-4 mt-1 border-gray-200" />
                <div className="mb-4 flex justify-between space-x-4">
                    <label className="text-grey-600 text-xs font-semibold">
                        {t('profile.fee') || 'Fixed Fee (USD)'}
                        <Input
                            className="mt-2"
                            value={rateAmount || ''}
                            onInput={(e) => {
                                const value = processStringAsNumber(e.currentTarget.value);
                                if (value === undefined) return;
                                handleUpdateInfluencer({ rateAmount: value }, rateAmountController);
                            }}
                            onBlur={(e) => {
                                const value = processStringAsNumber(e.currentTarget.value);
                                if (value === undefined) return;
                                handleUpdateInfluencer({ rateAmount: value }, rateAmountController, false); // don't debounce, update immediately
                            }}
                            placeholder="$250"
                        />
                    </label>
                    <label className="text-grey-600 text-xs font-semibold">
                        {t('profile.commissionRate') || 'Commission Rate'}
                        <Input
                            className="mt-2"
                            value={commissionRate || ''}
                            onInput={(e) => {
                                const value = processStringAsNumber(e.currentTarget.value);
                                if (value === undefined) return;
                                handleUpdateInfluencer(
                                    { commissionRate: processStringAsNumber(e.currentTarget.value) },
                                    commissionRateController,
                                );
                            }}
                            onBlur={(e) => {
                                const value = processStringAsNumber(e.currentTarget.value);
                                if (value === undefined) return;
                                handleUpdateInfluencer(
                                    { commissionRate: processStringAsNumber(e.currentTarget.value) },
                                    commissionRateController,
                                    false,
                                );
                            }}
                            placeholder="15%"
                        />
                    </label>
                </div>
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.affiliateLink') || 'Affiliate Link'}
                    <Input
                        className="mb-4 mt-2"
                        value={affiliateLink || ''}
                        onInput={(e) =>
                            handleUpdateInfluencer({ affiliateLink: e.currentTarget.value }, affiliateLinkController)
                        }
                        onBlur={(e) =>
                            handleUpdateInfluencer(
                                { affiliateLink: e.currentTarget.value },
                                affiliateLinkController,
                                false,
                            )
                        }
                        placeholder="https://chefly.shopify.com?code=2h42b2394h2"
                        type="text"
                    />
                </label>
                <div className="mb-4 mt-1">
                    <label className="text-grey-600 pt-4 text-xs font-semibold">
                        {t('profile.scheduledPostDate') || 'Scheduled Post Date'}
                        {/* TODO: Migrate to shadcn */}
                        <CollabScheduledPostDateInput
                            label={''}
                            value={scheduledPostDate ? dayjs(scheduledPostDate).format('YYYY-MM-DD') : undefined}
                            onInput={(e) =>
                                handleUpdateInfluencer(
                                    { scheduledPostDate: e.currentTarget.value },
                                    scheduledPostDateController,
                                )
                            }
                        />
                    </label>
                </div>

                <h2 className="mt-10 font-semibold">
                    {t('profile.shippingAndPersonalInfo') || 'Shipping & Personal Info'}
                </h2>
                <hr className="mb-4 mt-1 border-gray-200" />
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.name') || 'Name'}
                    <Input
                        className="mb-4 mt-2"
                        value={name || ''}
                        onInput={(e) => handleUpdateAddress({ name: e.currentTarget.value }, nameController)}
                        onBlur={(e) => handleUpdateAddress({ name: e.currentTarget.value }, nameController, false)}
                        placeholder="Eve Leroy"
                        type="text"
                    />
                </label>
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.phoneNumber') || 'Name'}
                    <Input
                        className="mb-4 mt-2"
                        value={phoneNumber || ''}
                        onInput={(e) =>
                            handleUpdateAddress({ phoneNumber: e.currentTarget.value }, phoneNumberController)
                        }
                        onBlur={(e) =>
                            handleUpdateAddress({ phoneNumber: e.currentTarget.value }, phoneNumberController, false)
                        }
                        placeholder="1-433-3453456"
                        type="text"
                    />
                </label>
                <hr className="mb-4 mt-1 border-gray-200" />
                <label className="text-grey-600  text-xs font-semibold">
                    {t('profile.streetAddress') || 'Street Address'}
                    <Input
                        className="mb-4 mt-2"
                        value={addressLine1 || ''}
                        onInput={(e) =>
                            handleUpdateAddress({ addressLine1: e.currentTarget.value }, addressLine1Controller)
                        }
                        onBlur={(e) =>
                            handleUpdateAddress({ addressLine2: e.currentTarget.value }, addressLine1Controller, false)
                        }
                        placeholder="755 Roosevelt Street"
                        type="text"
                    />
                </label>
                <div className="mb-4 mt-2 flex justify-between space-x-4">
                    <label className="text-grey-600  text-xs font-semibold">
                        {t('profile.city') || 'City'}
                        <Input
                            value={city || ''}
                            onInput={(e) => handleUpdateAddress({ city: e.currentTarget.value }, cityController)}
                            onBlur={(e) => handleUpdateAddress({ city: e.currentTarget.value }, cityController, false)}
                            placeholder="Chicago"
                            type="text"
                        />
                    </label>
                    <label className="text-grey-600 text-xs font-semibold">
                        {t('profile.state') || 'State'}
                        <Input
                            value={state || ''}
                            onInput={(e) => handleUpdateAddress({ state: e.currentTarget.value }, stateController)}
                            onBlur={(e) =>
                                handleUpdateAddress({ state: e.currentTarget.value }, stateController, false)
                            }
                            placeholder="Illinois"
                            type="text"
                        />
                    </label>
                </div>
                <div className="mb-6 mt-2 flex justify-between space-x-4">
                    <label className="text-grey-600 text-xs font-semibold">
                        {t('profile.postalCode') || 'Postal Code'}
                        <Input
                            value={postalCode || ''}
                            onInput={(e) =>
                                handleUpdateAddress({ postalCode: e.currentTarget.value }, postalCodeController)
                            }
                            onBlur={(e) =>
                                handleUpdateAddress({ postalCode: e.currentTarget.value }, postalCodeController, false)
                            }
                            placeholder="14450"
                            type="text"
                        />
                    </label>
                    <label className="text-grey-600 text-xs font-semibold">
                        {t('profile.country') || 'Country'}
                        <Input
                            value={country || ''}
                            onInput={(e) => handleUpdateAddress({ country: e.currentTarget.value }, countryController)}
                            onBlur={(e) =>
                                handleUpdateAddress({ country: e.currentTarget.value }, countryController, false)
                            }
                            placeholder="United States"
                            type="text"
                        />
                    </label>
                </div>
                <hr className="mb-4 border-gray-200" />
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.trackingCode') || 'Tracking Code'}
                    <Input
                        className="mb-4 mt-2"
                        value={trackingCode || ''}
                        onInput={(e) =>
                            handleUpdateAddress({ trackingCode: e.currentTarget.value }, trackingCodeController)
                        }
                        onBlur={(e) =>
                            handleUpdateAddress({ trackingCode: e.currentTarget.value }, trackingCodeController, false)
                        }
                        placeholder="FT2349834573..."
                        type="text"
                    />
                </label>
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.fullAddress') || 'Full Address'}
                    <Input
                        className="mb-4 mt-2"
                        readOnly
                        value={fullAddress}
                        placeholder="755 Roosevelt Street, New York, New York, 14..."
                        type="text"
                    />
                </label>
            </div>
        </>
    );
}
