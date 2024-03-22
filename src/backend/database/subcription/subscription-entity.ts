import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { type Nullable } from 'types/nullable';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity<T = any> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: CompanyEntity;

    @Column({ default: 'stripe' })
    provider!: string;

    @Column({ name: 'provider_subscription_id' })
    providerSubscriptionId!: string;

    @Column({ name: 'payment_method' })
    paymentMethod!: string;

    @Column('int')
    quantity!: number;

    @Column('numeric')
    price!: number;

    @Column('numeric')
    total!: number;

    @Column('numeric', { nullable: true })
    discount?: number;

    @Column({ nullable: true })
    coupon?: string;

    @Column({ name: 'subscription_data', type: 'json' })
    subscriptionData!: T;

    @Column({ name: 'provider_last_event', type: 'varchar', nullable: true })
    providerLastEvent?: Nullable<string>;

    @Column({ type: 'timestamp', nullable: true, name: 'active_at' })
    activeAt?: Nullable<Date>;

    @Column({ type: 'timestamp', nullable: true, name: 'paused_at' })
    pausedAt?: Nullable<Date>;

    @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
    cancelledAt?: Nullable<Date>;

    static getSubscriptionEntity<T>(e: SubscriptionEntity): SubscriptionEntity<T> {
        return e as SubscriptionEntity<T>;
    }
}