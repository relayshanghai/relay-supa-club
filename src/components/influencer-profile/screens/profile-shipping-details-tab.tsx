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
    onUpdate?: (key: keyof ProfileShippingDetails, value: any) => void;
};

export const ProfileShippingDetailsTab = (props: Props) => {
    const { onUpdate } = { onUpdate: () => null, ...props };
    const { state: data } = useProfileScreenContext();
    const { t } = useTranslation();

    return (
        <>
            <p className="mb-2 text-xl font-semibold text-gray-600">{t('profile.shippingDetails')}</p>
            <ShippingDetailsNameInput
                label={t('profile.name') || 'Name'}
                placeholder="D’Jan Curtis"
                value={data.shippingDetails.name}
                onInput={(e) => onUpdate('name', e.currentTarget.value)}
            />
            <ShippingDetailsPhoneNumberInput
                label={t('profile.phoneNumber') || 'Phone Number'}
                placeholder="1-433-3453456"
                value={data.shippingDetails.phoneNumber}
                onInput={(e) => onUpdate('phoneNumber', e.currentTarget.value)}
            />
            <ShippingDetailsStreetAddressInput
                label={t('profile.streetAddress') || 'Street Address'}
                placeholder="755 Roosevelt Street"
                value={data.shippingDetails.streetAddress}
                onInput={(e) => onUpdate('streetAddress', e.currentTarget.value)}
            />
            <ShippingDetailsCityInput
                label={t('profile.city') || 'City'}
                placeholder="New York"
                value={data.shippingDetails.city}
                onInput={(e) => onUpdate('city', e.currentTarget.value)}
            />
            <ShippingDetailsStateInput
                label={t('profile.state') || 'State'}
                placeholder="New York"
                value={data.shippingDetails.state}
                onInput={(e) => onUpdate('state', e.currentTarget.value)}
            />
            <ShippingDetailsCountryInput
                label={t('profile.country') || 'Country'}
                placeholder="United States"
                value={data.shippingDetails.country}
                onInput={(e) => onUpdate('country', e.currentTarget.value)}
            />
            <ShippingDetailsPostalCodeInput
                label={t('profile.postalCode') || 'Postal Code'}
                placeholder="14450"
                value={data.shippingDetails.postalCode}
                onInput={(e) => onUpdate('postalCode', e.currentTarget.value)}
            />
            <ShippingDetailsTrackingCodeInput
                label={t('profile.trackingCode') || 'Tracking Code'}
                value={data.shippingDetails.trackingCode}
                onInput={(e) => onUpdate('trackingCode', e.currentTarget.value)}
            />
            <ShippingDetailsFullAddressInput
                label={t('profile.fullAddress') || 'Full Address'}
                value={data.shippingDetails.fullAddress}
                onInput={(e) => onUpdate('fullAddress', e.currentTarget.value)}
            />
        </>
    );
};
