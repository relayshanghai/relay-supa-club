export type SetupIntentFailed = {
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
    automatic_payment_methods: null;
    cancellation_reason: null;
    client_secret: string;
    created: number;
    customer: string;
    description: null;
    flow_directions: null;
    last_setup_error: LastSetupError;
    latest_attempt: string;
    livemode: boolean;
    mandate: string;
    metadata: Metadata;
    next_action: null;
    on_behalf_of: null;
    payment_method: null;
    payment_method_configuration_details: null;
    payment_method_options: PaymentMethodOptions;
    payment_method_types: string[];
    single_use_mandate: null;
    status: string;
    usage: string;
};

export type LastSetupError = {
    code: string;
    doc_url: string;
    message: string;
    payment_method: PaymentMethod;
    type: string;
};

export type PaymentMethod = {
    id: string;
    object: string;
    alipay: Metadata;
    billing_details: BillingDetails;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Metadata;
    type: string;
};

export type Metadata = object;

export type BillingDetails = {
    address: Address;
    email: null;
    name: null;
    phone: null;
};

export type Address = {
    city: null;
    country: null;
    line1: null;
    line2: null;
    postal_code: null;
    state: null;
};

export type PaymentMethodOptions = {
    alipay: Alipay;
};

export type Alipay = {
    currency: string;
};

export type Request = {
    id: null;
    idempotency_key: string;
};
