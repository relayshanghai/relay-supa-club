export interface PaymentIntentSucceeded {
    id: string;
    object: string;
    api_version: Date;
    created: number;
    data: Data;
    livemode: boolean;
    pending_webhooks: number;
    request: Request;
    type: string;
}

export interface Data {
    object: DataObject;
}

export interface DataObject {
    id: string;
    object: string;
    amount: number;
    amount_capturable: number;
    amount_details: AmountDetails;
    amount_received: number;
    application: null;
    application_fee_amount: null;
    automatic_payment_methods: null;
    canceled_at: null;
    cancellation_reason: null;
    capture_method: string;
    charges: Charges;
    client_secret: string;
    confirmation_method: string;
    created: number;
    currency: string;
    customer: null;
    description: string;
    invoice: null;
    last_payment_error: null;
    latest_charge: string;
    livemode: boolean;
    metadata: Metadata;
    next_action: null;
    on_behalf_of: null;
    payment_method: string;
    payment_method_options: PaymentMethodOptions;
    payment_method_types: string[];
    processing: null;
    receipt_email: null;
    review: null;
    setup_future_usage: null;
    shipping: Shipping;
    source: null;
    statement_descriptor: null;
    statement_descriptor_suffix: null;
    status: string;
    transfer_data: null;
    transfer_group: null;
}

export interface AmountDetails {
    tip: Metadata;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Metadata {}

export interface Datum {
    id: string;
    object: string;
    amount: number;
    amount_captured: number;
    amount_refunded: number;
    application: null;
    application_fee: null;
    application_fee_amount: null;
    balance_transaction: string;
    billing_details: BillingDetails;
    calculated_statement_descriptor: string;
    captured: boolean;
    created: number;
    currency: string;
    customer: null;
    description: string;
    destination: null;
    dispute: null;
    disputed: boolean;
    failure_balance_transaction: null;
    failure_code: null;
    failure_message: null;
    fraud_details: Metadata;
    invoice: null;
    livemode: boolean;
    metadata: Metadata;
    on_behalf_of: null;
    order: null;
    outcome: Outcome;
    paid: boolean;
    payment_intent: string;
    payment_method: string;
    payment_method_details: PaymentMethodDetails;
    receipt_email: null;
    receipt_number: null;
    receipt_url: string;
    refunded: boolean;
    refunds: Charges;
    review: null;
    shipping: Shipping;
    source: null;
    source_transfer: null;
    statement_descriptor: null;
    statement_descriptor_suffix: null;
    status: string;
    transfer_data: null;
    transfer_group: null;
}

export interface Charges {
    object: string;
    data: Datum[];
    has_more: boolean;
    total_count: number;
    url: string;
}

export interface BillingDetails {
    address: Address;
    email: null;
    name: null;
    phone: null;
}

export interface Address {
    city: null | string;
    country: null | string;
    line1: null | string;
    line2: null;
    postal_code: null | string;
    state: null | string;
}

export interface Outcome {
    network_status: string;
    reason: null;
    risk_level: string;
    risk_score: number;
    seller_message: string;
    type: string;
}

export interface PaymentMethodDetails {
    card: PaymentMethodDetailsCard;
    type: string;
}

export interface PaymentMethodDetailsCard {
    brand: string;
    checks: Checks;
    country: string;
    exp_month: number;
    exp_year: number;
    extended_authorization: Authorization;
    fingerprint: string;
    funding: string;
    incremental_authorization: Authorization;
    installments: null;
    last4: string;
    mandate: null;
    network: string;
    network_token: NetworkToken;
    three_d_secure: null;
    wallet: null;
}

export interface Checks {
    address_line1_check: null;
    address_postal_code_check: null;
    cvc_check: null;
}

export interface Authorization {
    status: string;
}

export interface NetworkToken {
    used: boolean;
}

export interface Shipping {
    address: Address;
    carrier: null;
    name: string;
    phone: null;
    tracking_number: null;
}

export interface PaymentMethodOptions {
    card: PaymentMethodOptionsCard;
}

export interface PaymentMethodOptionsCard {
    installments: null;
    mandate_options: null;
    network: null;
    request_three_d_secure: string;
}

export interface Request {
    id: string;
    idempotency_key: string;
}
