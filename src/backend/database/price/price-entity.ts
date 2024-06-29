import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { type Nullable } from 'types/nullable';

export enum SubscriptionType {
    DISCOVERY = 'discovery',
    OUTREACH = 'outreach',
}
export enum SubscriptionBillingPeriod {
    MONTHLY = 'MONTHLY',
    ANNUALLY = 'ANNUALLY',
}

@Entity({ name: 'prices' })
@Unique('prices_price_id_key', ['priceId'])
export class PriceEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'subscription_type', type: 'varchar' })
    subscriptionType!: SubscriptionType;

    @Column({ name: 'currency', type: 'varchar' })
    currency!: string;

    @Column({ name: 'billing_period', type: 'varchar' })
    billingPeriod!: SubscriptionBillingPeriod;

    @Column({ name: 'price', type: 'decimal' })
    price!: number;

    @Column({ name: 'original_price', type: 'decimal' })
    originalPrice!: number;

    @Column({ name: 'profiles', type: 'int' })
    profiles!: number;

    @Column({ name: 'searches', type: 'int' })
    searches!: number;

    @Column({ name: 'price_id', type: 'varchar' })
    priceId!: string;

    @Column({ name: 'for_existing_user', type: 'decimal' })
    forExistingUser!: number;

    @Column({ name: 'price_id_for_existing_user', type: 'varchar' })
    priceIdsForExistingUser!: string;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Nullable<Date>;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Nullable<Date>;
}

export type RelayPrice = { [key in SubscriptionBillingPeriod]: PriceEntity[] };
