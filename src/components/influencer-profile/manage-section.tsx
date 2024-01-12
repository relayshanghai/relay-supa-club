import { useCallback, useEffect, useRef, useState } from 'react';
import { serverLogger } from 'src/utils/logger-server';
import toast from 'react-hot-toast';
import { atom, useAtom } from 'jotai';
import { OutreachCollabStatusInput } from './components/outreach-collab-status-input';
import { useTranslation } from 'react-i18next';
import type { CheckboxDropdownItemData } from './components/checkbox-dropdown-item';
import { Input } from 'shadcn/components/ui/input';
import { debounce } from 'src/utils/debounce';
import { wait } from 'src/utils/utils';
import { CollabScheduledPostDateInput } from './components/collab-scheduled-post-date-input';
import { apiFetch } from 'src/utils/api/api-fetch';
import type {
    SequenceInfluencersPutRequestBody,
    SequenceInfluencersPutRequestResponse,
} from 'pages/api/sequence-influencers';
import { sequenceInfluencersEndpointPath } from 'pages/api/sequence-influencers';
import type { Address } from 'src/backend/database/addresses';
import type { SequenceInfluencer } from 'src/backend/database/sequence-influencers';
import type { AddressesPutRequestBody, AddressesPutRequestResponse } from 'pages/api/addresses';
import { addressesEndpointPath } from 'pages/api/addresses';
import { doesObjectMatchUpdate } from 'src/utils/does-object-match-update';

export const COLLAB_STATUS_OPTIONS: CheckboxDropdownItemData[] = [
    {
        id: 'Negotiating',
        label: 'Negotiating',
        style: 'bg-blue-100 text-blue-500',
    },
    {
        id: 'Confirmed',
        label: 'Confirmed',
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'Shipped',
        label: 'Shipped',
        style: 'bg-yellow-100 text-yellow-500',
    },
    {
        id: 'Received',
        label: 'Received',
        style: 'bg-green-100 text-green-500',
    },
    {
        id: 'Content Approval',
        label: 'Content Approval',
        style: 'bg-pink-100 text-pink-500',
    },
    {
        id: 'Posted',
        label: 'Posted',
        style: 'bg-cyan-100 text-cyan-500',
    },
    {
        id: 'Rejected',
        label: 'Rejected',
        style: 'bg-red-100 text-red-500',
    },
];

export interface ManageSectionProps {
    influencer: SequenceInfluencer;
    address: Address;
}
export const manageSectionUpdatingAtom = atom(false);

export const ManageSection = ({ influencer: passedInfluencer, address: passedAddress }: ManageSectionProps) => {
    const { t } = useTranslation();

    const [influencer, setInfluencer] = useState<SequenceInfluencer>(passedInfluencer);
    useEffect(() => {
        setInfluencer(passedInfluencer);
    }, [passedInfluencer]);

    const [address, setAddress] = useState<Address>(passedAddress);
    useEffect(() => {
        setAddress(passedAddress);
    }, [passedAddress]);

    const { id, funnel_status, rate_amount, commission_rate, affiliate_link, scheduled_post_date } = influencer ?? {};
    const { name, phone_number, address_line_1, city, state, postal_code, country, tracking_code } = address ?? {};

    const [_updating, setUpdating] = useAtom(manageSectionUpdatingAtom);
    const influencerController = useRef(new AbortController());
    const addressController = useRef(new AbortController());

    const updateInfluencer = useCallback(
        async (body: SequenceInfluencersPutRequestBody) => {
            influencerController.current.abort();
            influencerController.current = new AbortController();

            setUpdating(true);
            const res = (
                await apiFetch<SequenceInfluencersPutRequestResponse, { body: SequenceInfluencersPutRequestBody }>(
                    sequenceInfluencersEndpointPath,
                    { body },
                    { method: 'PUT' },
                )
            ).content;
            setInfluencer(res);
            setUpdating(false);
        },
        [setUpdating],
    );

    const updateAddress = useCallback(
        async (body: AddressesPutRequestBody) => {
            addressController.current.abort();
            addressController.current = new AbortController();

            setUpdating(true);
            await wait(3000);
            const res = (
                await apiFetch<AddressesPutRequestResponse, { body: AddressesPutRequestBody }>(
                    addressesEndpointPath,
                    { body },
                    { method: 'PUT' },
                )
            ).content;
            setAddress(res);
            setUpdating(false);
        },
        [setUpdating],
    );

    const updateInfluencerDebounced = debounce(updateInfluencer, 2000);
    const updateAddressDebounced = debounce(updateAddress, 2000);

    const handleUpdateInfluencer = useCallback(
        async (update: Partial<SequenceInfluencer>, debounce = true) => {
            if (
                !influencer ||
                !update ||
                Object.keys(update).length === 0 ||
                doesObjectMatchUpdate(influencer, update)
            ) {
                return;
            }

            // optimistic update
            const previous = { ...influencer };
            setInfluencer({
                ...previous,
                ...update,
            });
            try {
                if (debounce) {
                    await updateInfluencerDebounced({
                        id,
                        ...update,
                    });
                } else {
                    await updateInfluencer({
                        id,
                        ...update,
                    });
                }
            } catch (error) {
                serverLogger(error);
                toast.error('Error updating influencer');
                setInfluencer(previous); // revert optimistic update
                setUpdating(false);
            }
        },
        [influencer, id, updateInfluencerDebounced, updateInfluencer, setUpdating],
    );

    const handleUpdateAddress = useCallback(
        async (update: Partial<Address>, debounce = true) => {
            if (!address || !update || Object.keys(update).length === 0 || doesObjectMatchUpdate(address, update)) {
                return;
            }

            // optimistic update
            const previous = { ...address };
            setAddress({
                ...previous,
                ...update,
            });
            try {
                if (debounce) {
                    await updateAddressDebounced({ id: address.id, ...update });
                } else {
                    await updateAddress({ id: address.id, ...update });
                }
            } catch (error) {
                serverLogger(error);
                toast.error('Error updating address');
                setAddress(previous); // revert optimistic update
                setUpdating(false);
            }
        },
        [address, updateAddressDebounced, updateAddress, setUpdating],
    );

    const fullAddress = `${address_line_1 ?? ''}, ${city ?? ''}, ${state ?? ''}, ${postal_code ?? ''}, ${
        country ?? ''
    }`;

    return (
        <div className="p-4 text-gray-600">
            <h2 className="font-semibold ">{t('profile.collab')}</h2>
            <hr className="mb-4 mt-1 border-gray-200" />

            <OutreachCollabStatusInput
                label={t('profile.collabStatus') as string}
                onUpdate={(items) => {
                    const selected = items.length > 0 ? items[0].id : funnel_status;
                    if (selected === funnel_status) return;
                    handleUpdateInfluencer({ funnel_status: selected }, false);
                }}
                options={COLLAB_STATUS_OPTIONS}
                selected={[funnel_status]}
            />
            {/* notes */}
            {/* <textarea /> */}
            <div>
                {/* view all notes button */}
                {/* add note button */}
            </div>

            <h2 className="mt-10 font-semibold">{t('profile.compAndDeliverables') || 'Compensation & Deliverables'}</h2>
            <hr className="mb-4 mt-1 border-gray-200" />
            <div className="mb-4 flex justify-between space-x-4">
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.fee') || 'Fixed Fee (USD)'}
                    <Input
                        className="mt-2"
                        value={rate_amount ?? undefined}
                        onInput={(e) =>
                            handleUpdateInfluencer({
                                rate_amount: e.currentTarget.value ? Number(e.currentTarget.value) : undefined,
                            })
                        }
                        onBlur={
                            (e) =>
                                handleUpdateInfluencer(
                                    { rate_amount: e.currentTarget.value ? Number(e.currentTarget.value) : undefined },
                                    false,
                                ) // don't debounce, update immediately
                        }
                        placeholder="$250"
                    />
                </label>
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.commissionRate') || 'Commission Rate'}
                    <Input
                        className="mt-2"
                        value={commission_rate ?? undefined}
                        onInput={(e) => handleUpdateInfluencer({ commission_rate: Number(e.currentTarget.value) })}
                        onBlur={(e) =>
                            handleUpdateInfluencer({ commission_rate: Number(e.currentTarget.value) }, false)
                        }
                        placeholder="15%"
                    />
                </label>
            </div>
            <label className="text-grey-600 text-xs font-semibold">
                {t('profile.affiliateLink') || 'Affiliate Link'}
                <Input
                    className="mb-4 mt-2"
                    value={affiliate_link ?? undefined}
                    onInput={(e) => handleUpdateInfluencer({ affiliate_link: e.currentTarget.value })}
                    onBlur={(e) => handleUpdateInfluencer({ affiliate_link: e.currentTarget.value }, false)}
                    placeholder="chefly.shopify.com?code=2h42b2394h2"
                    type="text"
                />
            </label>
            <div className="mb-4 mt-1">
                <label className="text-grey-600 pt-4 text-xs font-semibold">
                    {t('profile.scheduledPostDate') || 'Scheduled Post Date'}
                    {/* TODO: Migrate to shadcn */}
                    <CollabScheduledPostDateInput
                        label={''}
                        value={scheduled_post_date ?? undefined}
                        onInput={(e) => handleUpdateInfluencer({ scheduled_post_date: e.currentTarget.value })}
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
                    value={name ?? undefined}
                    onInput={(e) => handleUpdateAddress({ name: e.currentTarget.value })}
                    onBlur={(e) => handleUpdateAddress({ name: e.currentTarget.value }, false)}
                    placeholder="Eve Leroy"
                    type="text"
                />
            </label>
            <label className="text-grey-600 text-xs font-semibold">
                {t('profile.phoneNumber') || 'Name'}
                <Input
                    className="mb-4 mt-2"
                    value={phone_number ?? undefined}
                    onInput={(e) => handleUpdateAddress({ phone_number: e.currentTarget.value })}
                    onBlur={(e) => handleUpdateAddress({ phone_number: e.currentTarget.value }, false)}
                    placeholder="1-433-3453456"
                    type="text"
                />
            </label>
            <hr className="mb-4 mt-1 border-gray-200" />
            <label className="text-grey-600  text-xs font-semibold">
                {t('profile.streetAddress') || 'Street Address'}
                <Input
                    className="mb-4 mt-2"
                    value={address_line_1 ?? undefined}
                    onInput={(e) => handleUpdateAddress({ address_line_1: e.currentTarget.value })}
                    onBlur={(e) => handleUpdateAddress({ address_line_1: e.currentTarget.value }, false)}
                    placeholder="755 Roosevelt Street"
                    type="text"
                />
            </label>
            <div className="mb-4 mt-2 flex justify-between space-x-4">
                <label className="text-grey-600  text-xs font-semibold">
                    {t('profile.city') || 'City'}
                    <Input
                        value={city ?? undefined}
                        onInput={(e) => handleUpdateAddress({ city: e.currentTarget.value })}
                        onBlur={(e) => handleUpdateAddress({ city: e.currentTarget.value }, false)}
                        placeholder="Chicago"
                        type="text"
                    />
                </label>
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.state') || 'State'}
                    <Input
                        value={state ?? undefined}
                        onInput={(e) => handleUpdateAddress({ state: e.currentTarget.value })}
                        onBlur={(e) => handleUpdateAddress({ state: e.currentTarget.value }, false)}
                        placeholder="Illinois"
                        type="text"
                    />
                </label>
            </div>
            <div className="mb-6 mt-2 flex justify-between space-x-4">
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.postalCode') || 'Postal Code'}
                    <Input
                        value={postal_code ?? undefined}
                        onInput={(e) => handleUpdateAddress({ postal_code: e.currentTarget.value })}
                        onBlur={(e) => handleUpdateAddress({ postal_code: e.currentTarget.value }, false)}
                        placeholder="14450"
                        type="text"
                    />
                </label>{' '}
                <label className="text-grey-600 text-xs font-semibold">
                    {t('profile.country') || 'Country'}
                    <Input
                        value={country ?? undefined}
                        onInput={(e) => handleUpdateAddress({ country: e.currentTarget.value })}
                        onBlur={(e) => handleUpdateAddress({ country: e.currentTarget.value }, false)}
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
                    value={tracking_code ?? undefined}
                    onInput={(e) => handleUpdateAddress({ tracking_code: e.currentTarget.value })}
                    onBlur={(e) => handleUpdateAddress({ tracking_code: e.currentTarget.value }, false)}
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
    );
};
