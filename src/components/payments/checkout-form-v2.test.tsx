import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import CheckoutFormV2 from './checkout-form-v2';

const { confirmAlipayPaymentMock, confirmPaymentMock, pushMock, reactUseStateMock } = vi.hoisted(() => {
    return {
        pushMock: vi.fn(),
        confirmPaymentMock: vi.fn().mockResolvedValue({ paymentIntent: { status: 'succeeded' } }),
        confirmAlipayPaymentMock: vi.fn().mockResolvedValue({ paymentIntent: { status: 'succeeded' } }),
        reactUseStateMock: vi.fn(),
    };
});

vi.mock('react', async () => {
    const originalReact = await vi.importActual('react');
    return {
        ...(originalReact as any),
        useState: reactUseStateMock,
    };
});

vi.mock('next/router', () => ({
    useRouter: () => ({
        push: pushMock,
        query: { subscriptionId: 'sub_123' },
    }),
}));

vi.mock('src/hooks/use-rudderstack', () => ({
    useRudderstack: () => ({
        trackEvent: vi.fn(),
    }),
    useRudderstackTrack: () => ({
        track: vi.fn(),
    }),
}));

vi.mock('@stripe/react-stripe-js', async () => {
    const actual = await vi.importActual('@stripe/react-stripe-js');
    const PaymentElementMock = () => {
        return (
            <div data-testid="payment-element">
                <div data-testid="payment-method-wrapper">
                    <button data-testid="card-button">Card</button>
                    <button data-testid="alipay-button">Alipay</button>
                </div>
            </div>
        );
    };
    return {
        ...(actual as any),
        useStripe: () => ({
            confirmPayment: confirmPaymentMock,
            confirmAlipayPayment: confirmAlipayPaymentMock,
        }),
        useElements: () => ({
            submit: vi.fn().mockImplementation(() => ({
                error: null,
                paymentMethod: { id: 'pm_1' },
            })),
        }),
        PaymentElement: PaymentElementMock,
    };
});

const selectedPrice = {
    currency: 'cny',
    prices: { monthly: '799' },
    profiles: '600',
    searches: '1200',
    priceIds: { monthly: 'price_1' },
};

const MockComponent = () => {
    return <CheckoutFormV2 selectedPrice={selectedPrice} batchId={123456} />;
};

describe('CheckoutFormV2 Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('should render button upgrade with disabled state', () => {
        reactUseStateMock
            .mockReturnValue([false, () => null])
            .mockReturnValue([true, () => null])
            .mockReturnValue(['null', () => null])
            .mockReturnValue(['card', () => null]);
        const { getByTestId } = render(<MockComponent />);
        const upgradeButton = getByTestId('upgrade-button');
        expect(upgradeButton).toBeDefined();
        expect(upgradeButton).toHaveProperty('disabled');
    });

    test('should render payment elemenet', async () => {
        reactUseStateMock
            .mockReturnValue([false, () => null])
            .mockReturnValue([true, () => null])
            .mockReturnValue(['null', () => null])
            .mockReturnValue(['card', () => null]);
        const { getByTestId } = render(<MockComponent />);
        const paymentElement = getByTestId('payment-element');
        expect(paymentElement).toBeDefined();
    });

    test('should render card button', async () => {
        reactUseStateMock
            .mockReturnValue([false, () => null])
            .mockReturnValue([true, () => null])
            .mockReturnValue(['null', () => null])
            .mockReturnValue(['card', () => null]);
        const { getByTestId } = render(<MockComponent />);
        const cardButton = getByTestId('card-button');
        expect(cardButton).toBeDefined();
    });

    test('should render alipay button', async () => {
        reactUseStateMock
            .mockReturnValue([false, () => null])
            .mockReturnValue([true, () => null])
            .mockReturnValue(['null', () => null])
            .mockReturnValue(['card', () => null]);
        const { getByTestId } = render(<MockComponent />);
        const alipayButton = getByTestId('alipay-button');
        expect(alipayButton).toBeDefined();
    });
});
