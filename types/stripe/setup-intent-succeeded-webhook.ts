export type SetupIntentSucceeded = {
    id: string;
    object: string;
    api_version: string | null;
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
    last_setup_error: null;
    latest_attempt: string;
    livemode: boolean;
    mandate: string;
    metadata: Metadata;
    next_action: null;
    on_behalf_of: null;
    payment_method: string;
    payment_method_configuration_details: null;
    payment_method_options: PaymentMethodOptions;
    payment_method_types: string[];
    single_use_mandate: null;
    status: string;
    usage: string;
};

//eslint-disable-next-line
export type Metadata = Object;

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
