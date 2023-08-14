import { ShippingDetailsCityInput } from './shipping-details-city-input';
import { ShippingDetailsCountryInput } from './shipping-details-country-input';
import { ShippingDetailsFullAddressInput } from './shipping-details-full-address-input';
import { ShippingDetailsNameInput } from './shipping-details-name-input';
import { ShippingDetailsPhoneNumberInput } from './shipping-details-phone-number-input';
import { ShippingDetailsPostalCodeInput } from './shipping-details-postal-code-input';
import { ShippingDetailsStateInput } from './shipping-details-state-input';
import { ShippingDetailsStreetAddressInput } from './shipping-details-street-address-input';
import { ShippingDetailsTrackingCodeInput } from './shipping-details-tracking-code-input';
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

    return (
        <>
            <ShippingDetailsNameInput
                value={data.shippingDetails.name}
                onInput={(e) => onUpdate('name', e.currentTarget.value)}
            />
            <ShippingDetailsPhoneNumberInput
                value={data.shippingDetails.phoneNumber}
                onInput={(e) => onUpdate('phoneNumber', e.currentTarget.value)}
            />
            <ShippingDetailsStreetAddressInput
                value={data.shippingDetails.streetAddress}
                onInput={(e) => onUpdate('streetAddress', e.currentTarget.value)}
            />
            <ShippingDetailsCityInput
                value={data.shippingDetails.city}
                onInput={(e) => onUpdate('city', e.currentTarget.value)}
            />
            <ShippingDetailsStateInput
                value={data.shippingDetails.state}
                onInput={(e) => onUpdate('state', e.currentTarget.value)}
            />
            <ShippingDetailsCountryInput
                value={data.shippingDetails.country}
                onInput={(e) => onUpdate('country', e.currentTarget.value)}
            />
            <ShippingDetailsPostalCodeInput
                value={data.shippingDetails.postalCode}
                onInput={(e) => onUpdate('postalCode', e.currentTarget.value)}
            />
            <ShippingDetailsTrackingCodeInput
                value={data.shippingDetails.trackingCode}
                onInput={(e) => onUpdate('trackingCode', e.currentTarget.value)}
            />
            <ShippingDetailsFullAddressInput
                value={data.shippingDetails.fullAddress}
                onInput={(e) => onUpdate('fullAddress', e.currentTarget.value)}
            />
        </>
    );
};
