import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';

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

    @Column({ type: 'timestamp', nullable: true, name: 'active_at' })
    activeAt?: Date | null;

    @Column({ type: 'timestamp', nullable: true, name: 'paused_at' })
    pausedAt?: Date | null;

    @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
    cancelledAt?: Date | null;

    static getSubscriptionEntity<T>(e: SubscriptionEntity): SubscriptionEntity<T> {
        return e as SubscriptionEntity<T>;
    }
}
