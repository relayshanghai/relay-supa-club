// Generated by https://quicktype.io

import { UsageType } from 'types/appTypes';

export interface InvoicePaidWebhook {
    object: InvoicePaidWebhookObject;
}

export interface InvoicePaidWebhookObject {
    id: string;
    object: string;
    account_country: string;
    account_name: string;
    account_tax_ids: null;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    amount_shipping: number;
    application: null;
    application_fee_amount: null;
    attempt_count: number;
    attempted: boolean;
    auto_advance: boolean;
    automatic_tax: AutomaticTax;
    billing_reason: string;
    charge: string;
    collection_method: string;
    created: number;
    currency: string;
    custom_fields: CustomField[];
    customer: string;
    customer_address: null;
    customer_email: null;
    customer_name: string;
    customer_phone: null;
    customer_shipping: null;
    customer_tax_exempt: string;
    customer_tax_ids: any[];
    default_payment_method: null;
    default_source: null;
    default_tax_rates: any[];
    description: null;
    discount: null;
    discounts: any[];
    due_date: number;
    ending_balance: number;
    footer: null;
    from_invoice: null;
    hosted_invoice_url: string;
    invoice_pdf: string;
    last_finalization_error: null;
    latest_revision: null;
    lines: Lines;
    livemode: boolean;
    metadata: Metadata;
    next_payment_attempt: null;
    number: string;
    on_behalf_of: null;
    paid: boolean;
    paid_out_of_band: boolean;
    payment_intent: string;
    payment_settings: PaymentSettings;
    period_end: number;
    period_start: number;
    post_payment_credit_notes_amount: number;
    pre_payment_credit_notes_amount: number;
    quote: null;
    receipt_number: null;
    rendering_options: RenderingOptions;
    shipping_cost: null;
    shipping_details: null;
    starting_balance: number;
    statement_descriptor: null;
    status: string;
    status_transitions: StatusTransitions;
    subscription: null;
    subtotal: number;
    subtotal_excluding_tax: number;
    tax: null;
    test_clock: null;
    total: number;
    total_discount_amounts: any[];
    total_excluding_tax: number;
    total_tax_amounts: any[];
    transfer_data: null;
    webhooks_delivered_at: number;
}

export interface AutomaticTax {
    enabled: boolean;
    status: null;
}

// Make sure when generating the invoice to make these custom fields match the usage type
export interface CustomField {
    name: UsageType;
    value: string;
}

export interface Lines {
    object: string;
    data: Datum[];
    has_more: boolean;
    total_count: number;
    url: string;
}

export interface Datum {
    id: string;
    object: string;
    amount: number;
    amount_excluding_tax: number;
    currency: string;
    description: string;
    discount_amounts: any[];
    discountable: boolean;
    discounts: any[];
    invoice_item: string;
    livemode: boolean;
    metadata: Metadata;
    period: Period;
    plan: null;
    price: Price;
    proration: boolean;
    proration_details: ProrationDetails;
    quantity: number;
    subscription: null;
    tax_amounts: any[];
    tax_rates: any[];
    type: string;
    unit_amount_excluding_tax: string;
}

export interface Metadata {
    [key: string]: string;
}

export interface Period {
    end: number;
    start: number;
}

export interface Price {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    custom_unit_amount: null;
    livemode: boolean;
    lookup_key: null;
    metadata: Metadata;
    nickname: null;
    product: string;
    recurring: null;
    tax_behavior: string;
    tiers_mode: null;
    transform_quantity: null;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
}

export interface ProrationDetails {
    credited_items: null;
}

export interface PaymentSettings {
    default_mandate: null;
    payment_method_options: null;
    payment_method_types: null;
}

export interface RenderingOptions {
    amount_tax_display: string;
}

export interface StatusTransitions {
    finalized_at: number;
    marked_uncollectible_at: null;
    paid_at: number;
    voided_at: null;
}
