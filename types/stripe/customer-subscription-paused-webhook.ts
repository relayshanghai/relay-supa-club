export type CustomerSubscriptionPaused = {
    id: string;
    object: string;
    api_version: Date;
    created: number;
    data: Data;
    livemode: boolean;
    pending_webhooks: number;
    request: Request;
    type: string;
};

export type Data = {
    object: DataObject;
};

export type DataObject = {
    id: string;
    object: string;
    application: null;
    application_fee_percent: null;
    automatic_tax: AutomaticTax;
    billing_cycle_anchor: number;
    billing_thresholds: null;
    cancel_at: null;
    cancel_at_period_end: boolean;
    canceled_at: null;
    cancellation_details: CancellationDetails;
    collection_method: string;
    created: number;
    currency: string;
    current_period_end: number;
    current_period_start: number;
    customer: string;
    days_until_due: null;
    default_payment_method: null;
    default_source: null;
    default_tax_rates: any[];
    description: null;
    discount: null;
    ended_at: null;
    items: Items;
    latest_invoice: string;
    livemode: boolean;
    metadata: Metadata;
    next_pending_invoice_item_invoice: null;
    on_behalf_of: null;
    pause_collection: null;
    payment_settings: PaymentSettings;
    pending_invoice_item_interval: null;
    pending_setup_intent: string;
    pending_update: null;
    plan: Plan;
    quantity: number;
    schedule: null;
    start_date: number;
    status: string;
    test_clock: string;
    transfer_data: null;
    trial_end: number;
    trial_settings: TrialSettings;
    trial_start: number;
};

export type AutomaticTax = {
    enabled: boolean;
};

export type CancellationDetails = {
    comment: null;
    feedback: null;
    reason: null;
};

export type Items = {
    object: string;
    data: Datum[];
    has_more: boolean;
    total_count: number;
    url: string;
};

export type Datum = {
    id: string;
    object: string;
    billing_thresholds: null;
    created: number;
    metadata: Metadata;
    plan: Plan;
    price: Price;
    quantity: number;
    subscription: string;
    tax_rates: any[];
};

export type Metadata = object;

export type Plan = {
    id: string;
    object: string;
    active: boolean;
    aggregate_usage: null;
    amount: number;
    amount_decimal: string;
    billing_scheme: string;
    created: number;
    currency: string;
    interval: string;
    interval_count: number;
    livemode: boolean;
    metadata: Metadata;
    nickname: null;
    product: string;
    tiers_mode: null;
    transform_usage: null;
    trial_period_days: null;
    usage_type: string;
};

export type Price = {
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
    recurring: Recurring;
    tax_behavior: string;
    tiers_mode: null;
    transform_quantity: null;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
};

export type Recurring = {
    aggregate_usage: null;
    interval: string;
    interval_count: number;
    trial_period_days: null;
    usage_type: string;
};

export type PaymentSettings = {
    payment_method_options: null;
    payment_method_types: null;
    save_default_payment_method: string;
};

export type TrialSettings = {
    end_behavior: EndBehavior;
};

export type EndBehavior = {
    missing_payment_method: string;
};

export type Request = {
    id: null;
    idempotency_key: null;
};
