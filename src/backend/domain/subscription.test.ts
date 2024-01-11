import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { vi } from 'vitest';

const listMock = vi.fn();
stripeClient.subscriptions.list = listMock;

listMock.mockResolvedValue({
    //
});
