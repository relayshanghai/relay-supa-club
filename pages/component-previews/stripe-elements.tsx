// TODO: remove this preview page https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/454 V2-454ae

import { Modal } from 'src/components/modal';
import { useState } from 'react';

import { OnboardPaymentSection } from 'src/components/signup/onboard-payment-section';
import { STRIPE_PRICE_MONTHLY_DIY } from 'src/utils/api/stripe/constants';
import { PricingSection } from 'src/components/signup/pricing-section';

const CheckoutForm = () => {
    const [priceId, setPriceId] = useState<string>(STRIPE_PRICE_MONTHLY_DIY);
    return (
        <Modal maxWidth="max-w-5xl" visible={true} onClose={() => null}>
            <div className="flex justify-around">
                <div className=" p-10">
                    <PricingSection setPriceId={setPriceId} />
                </div>
                <div className="w-1/3 p-10">
                    <OnboardPaymentSection priceId={priceId} />
                </div>
            </div>
        </Modal>
    );
};

export default CheckoutForm;
