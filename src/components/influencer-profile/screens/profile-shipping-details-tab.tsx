import { useTranslation } from 'react-i18next';
import { ShippingDetailsCityInput } from '../components/shipping-details-city-input';
import { ShippingDetailsCountryInput } from '../components/shipping-details-country-input';
import { ShippingDetailsFullAddressInput } from '../components/shipping-details-full-address-input';
import { ShippingDetailsNameInput } from '../components/shipping-details-name-input';
import { ShippingDetailsPhoneNumberInput } from '../components/shipping-details-phone-number-input';
import { ShippingDetailsPostalCodeInput } from '../components/shipping-details-postal-code-input';
import { ShippingDetailsStateInput } from '../components/shipping-details-state-input';
import { ShippingDetailsStreetAddressInput } from '../components/shipping-details-street-address-input';
import { ShippingDetailsTrackingCodeInput } from '../components/shipping-details-tracking-code-input';
import { useProfileScreenContext } from '../screens/profile-screen-context';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { UpdateInfluencerProfilePayload } from 'src/utils/analytics/events/outreach/update-influencer-profile';

export type ProfileShippingDetails = {
    name: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    trackingCode: string;
    fullAddress: string;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    onUpdate?: (key: keyof ProfileShippingDetails, value: any) => void;
    trackProfileFieldUpdate: (payload: Omit<UpdateInfluencerProfilePayload, 'batch_id'>) => void;
};

export const ProfileShippingDetailsTab = (props: Props) => {
    const { onUpdate } = { onUpdate: () => null, ...props };
    const { state: data } = useProfileScreenContext();
    const { t } = useTranslation();

    return (
        <>
            <p className="mb-2 text-xl font-semibold text-gray-600">{t('profile.shippingDetails')}</p>
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsNameInput
                    label={t('profile.name') as string}
                    placeholder="D’Jan Curtis"
                    value={data.shippingDetails.name}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'Name',
                            previously_empty: data.shippingDetails.name === '',
                        });
                        onUpdate('name', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsPhoneNumberInput
                    label={t('profile.phoneNumber') as string}
                    placeholder="1-433-3453456"
                    value={data.shippingDetails.phoneNumber}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'Phone Number',
                            previously_empty: data.shippingDetails.phoneNumber === '',
                        });
                        onUpdate('phoneNumber', e.currentTarget.value);
                    }}
                />
            </section>
            <div className="mb-6 h-px border border-neutral-200" />
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsStreetAddressInput
                    label={t('profile.streetAddress') as string}
                    placeholder="755 Roosevelt Street"
                    value={data.shippingDetails.streetAddress}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'Street Address',
                            previously_empty: data.shippingDetails.streetAddress === '',
                        });
                        onUpdate('streetAddress', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsCityInput
                    label={t('profile.city') as string}
                    placeholder="New York"
                    value={data.shippingDetails.city}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'City',
                            previously_empty: data.shippingDetails.city === '',
                        });
                        onUpdate('city', e.currentTarget.value);
                    }}
                />
            </section>
            <section className="grid grid-rows-1 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsStateInput
                    label={t('profile.state') as string}
                    placeholder="New York"
                    value={data.shippingDetails.state}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'State',
                            previously_empty: data.shippingDetails.state === '',
                        });
                        onUpdate('state', e.currentTarget.value);
                    }}
                />
                <section className="grid grid-cols-2 gap-4">
                    <ShippingDetailsCountryInput
                        label={t('profile.country') as string}
                        placeholder="United States"
                        value={data.shippingDetails.country}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: props.profile.influencer_social_profile_id ?? '',
                                updated_field: 'Country',
                                previously_empty: data.shippingDetails.country === '',
                            });
                            onUpdate('country', e.currentTarget.value);
                        }}
                    />
                    <ShippingDetailsPostalCodeInput
                        label={t('profile.postalCode') as string}
                        placeholder="14450"
                        value={data.shippingDetails.postalCode}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: props.profile.influencer_social_profile_id ?? '',
                                updated_field: 'Postal Code',
                                previously_empty: data.shippingDetails.postalCode === '',
                            });
                            onUpdate('postalCode', e.currentTarget.value);
                        }}
                    />
                </section>
            </section>
            <div className="mb-6 h-px border border-neutral-200" />
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsTrackingCodeInput
                    label={t('profile.trackingCode') as string}
                    value={data.shippingDetails.trackingCode}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'Tracking Code',
                            previously_empty: data.shippingDetails.trackingCode === '',
                        });
                        onUpdate('trackingCode', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsFullAddressInput
                    label={t('profile.fullAddress') as string}
                    value={data.shippingDetails.fullAddress}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: props.profile.influencer_social_profile_id ?? '',
                            updated_field: 'Full Address',
                            previously_empty: data.shippingDetails.fullAddress === '',
                        });
                        onUpdate('fullAddress', e.currentTarget.value);
                    }}
                />
            </section>
        </>
    );
};
