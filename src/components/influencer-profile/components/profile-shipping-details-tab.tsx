import { useCallback, useState } from 'react';
import { ShippingDetailsCityInput } from './shipping-details-city-input';
import { ShippingDetailsCountryInput } from './shipping-details-country-input';
import { ShippingDetailsFullAddressInput } from './shipping-details-full-address-input';
import { ShippingDetailsNameInput } from './shipping-details-name-input';
import { ShippingDetailsPhoneNumberInput } from './shipping-details-phone-number-input';
import { ShippingDetailsPostalCodeInput } from './shipping-details-postal-code-input';
import { ShippingDetailsStateInput } from './shipping-details-state-input';
import { ShippingDetailsStreetAddressInput } from './shipping-details-street-address-input';
import { ShippingDetailsTrackingCodeInput } from './shipping-details-tracking-code-input';

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
    onUpdate?: (data: ProfileShippingDetails) => void;
    value?: Partial<ProfileShippingDetails>;
};

export const ProfileShippingDetailsTab = (props: Props) => {
    const [data, setData] = useState<ProfileShippingDetails>(() => {
        return {
            name: '',
            phoneNumber: '',
            streetAddress: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            trackingCode: '',
            fullAddress: '',
            ...props.value,
        };
    });

    const handleUpdate = useCallback(
        (k: string, v: string) => {
            setData((state) => {
                return { ...state, [k]: v };
            });
            props.onUpdate && props.onUpdate(data);
        },
        [data, props],
    );

    return (
        <>
            <ShippingDetailsNameInput value={data.name} onInput={(e) => handleUpdate('name', e.currentTarget.value)} />
            <ShippingDetailsPhoneNumberInput
                value={data.phoneNumber}
                onInput={(e) => handleUpdate('phoneNumber', e.currentTarget.value)}
            />
            <ShippingDetailsStreetAddressInput
                value={data.streetAddress}
                onInput={(e) => handleUpdate('streetAddress', e.currentTarget.value)}
            />
            <ShippingDetailsCityInput value={data.city} onInput={(e) => handleUpdate('city', e.currentTarget.value)} />
            <ShippingDetailsStateInput
                value={data.state}
                onInput={(e) => handleUpdate('state', e.currentTarget.value)}
            />
            <ShippingDetailsCountryInput
                value={data.country}
                onInput={(e) => handleUpdate('country', e.currentTarget.value)}
            />
            <ShippingDetailsPostalCodeInput
                value={data.postalCode}
                onInput={(e) => handleUpdate('postalCode', e.currentTarget.value)}
            />
            <ShippingDetailsTrackingCodeInput
                value={data.trackingCode}
                onInput={(e) => handleUpdate('trackingCode', e.currentTarget.value)}
            />
            <ShippingDetailsFullAddressInput
                value={data.fullAddress}
                onInput={(e) => handleUpdate('fullAddress', e.currentTarget.value)}
            />
        </>
    );
};
