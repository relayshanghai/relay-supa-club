import React from 'react';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PromoCodeSectionV2 } from './promo-code-section-v2';

const { pushMock, reactUseStateMock, applyCouponMock, setApplyCouponResponseMock } = vi.hoisted(() => {
    return {
        pushMock: vi.fn(),
        reactUseStateMock: vi.fn(),
        applyCouponMock: vi.fn(),
        useLocalStorageSubscribeResponseMock: vi.fn().mockReturnValue([{}, () => []]),
        setApplyCouponResponseMock: vi.fn().mockReturnValue([{}, () => []]),
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
vi.mock('src/hooks/v2/use-subscription', () => ({
    useCouponV2: () => ({
        applyCoupon: applyCouponMock,
    }),
    useLocalStorageSubscribeResponse: () => [
        {},
        () => {
            return null;
        },
    ],
}));
vi.mock('src/hooks/v2/use-subscription', () => ({
    useCouponV2: () => ({
        applyCoupon: applyCouponMock,
    }),
    useLocalStorageSubscribeResponse: () => [
        {},
        () => {
            return null;
        },
    ],
    useApplyCouponResponseStore: () => ({
        setApplyCouponResponse: setApplyCouponResponseMock,
    }),
}));
const selectedPrice = {
    currency: 'cny',
    prices: { monthly: '799' },
    profiles: '600',
    searches: '1200',
    priceIds: { monthly: 'price_1' },
};

const MockComponent = () => {
    return <PromoCodeSectionV2 selectedPrice={selectedPrice} priceTier="outreach" setCouponId={() => null} />;
};

describe('PromoCodeSectionV2 Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('should render form', () => {
        reactUseStateMock.mockReturnValue([false, () => null]);
        const { getByTestId } = render(<MockComponent />);
        const applyCouponButton = getByTestId('apply-coupon-button');
        const couponInput = getByTestId('coupon-input');
        expect(applyCouponButton).toBeDefined();
        expect(couponInput).toBeDefined();
    });

    test('should hit apply coupon when button enter on keyboard pressed', () => {
        reactUseStateMock.mockReturnValue([false, () => null]);
        const { getByTestId } = render(<MockComponent />);
        const couponInput = getByTestId('coupon-input');

        act(() => {
            fireEvent.change(couponInput, { target: { value: '123' } });
            fireEvent.keyDown(couponInput, { key: 'Enter', code: 'Enter' });
        });
        expect(applyCouponMock).toBeCalled();
    });

    test('should hit apply coupon when Apply button is clicked', () => {
        reactUseStateMock.mockReturnValue([false, () => null]);
        const { getByTestId } = render(<MockComponent />);
        const applyCouponButton = getByTestId('apply-coupon-button');
        act(() => {
            fireEvent.click(applyCouponButton);
        });
        expect(applyCouponMock).toBeCalled();
    });
});
