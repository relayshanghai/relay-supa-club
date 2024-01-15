import { stripeClient } from './stripe-client';

export const getCustomerPaymentMethods = async (customerId: string) => {
    const customerPaymentMethods = await stripeClient.customers.listPaymentMethods(customerId);
    return customerPaymentMethods.data;
};
