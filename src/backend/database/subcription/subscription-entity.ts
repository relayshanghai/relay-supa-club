import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, AfterLoad, type Relation } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { type Nullable } from 'types/nullable';
import { DISCOVERY_PLAN } from 'src/utils/api/stripe/constants';
import { getDayDifference } from 'src/utils/time';

export enum SubscriptionStatus {
    TRIAL = 'TRIAL',
    TRIAL_EXPIRED = 'TRIAL_EXPIRED',
    TRIAL_CANCELLED = 'TRIAL_CANCELLED',
    ACTIVE = 'ACTIVE',
    PASS_DUE = 'PASS_DUE',
    CANCELLED = 'CANCELLED',
    UNKNOWN = 'UNKNOWN',
}

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity<T = any> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: Relation<CompanyEntity>;

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

    @Column({ type: 'varchar' })
    interval!: string;

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

    @AfterLoad()
    setStatus() {
        let s = SubscriptionStatus.UNKNOWN;
        const currentTime = new Date();
        const activeAt = this.activeAt as Date;
        const cancelledAt = this.cancelledAt as Date;
        const pausedAt = this.pausedAt as Date;
        // count day difference between cancelledAt to today date
        const { trial_days } = DISCOVERY_PLAN;
        const diffActiveAtToCancelledAt = Math.abs(getDayDifference(activeAt, cancelledAt));
        const diffActiveAtToPausedAt = Math.abs(getDayDifference(activeAt, pausedAt));
        const isTrialSubscription =
            (diffActiveAtToCancelledAt && diffActiveAtToCancelledAt === +trial_days) ||
            (diffActiveAtToPausedAt && diffActiveAtToPausedAt === +trial_days);

        if (activeAt === null && currentTime < cancelledAt) {
            s = SubscriptionStatus.TRIAL;
        } else if (
            (activeAt === null && currentTime > cancelledAt) ||
            (activeAt !== null && currentTime > pausedAt && isTrialSubscription)
        ) {
            s = SubscriptionStatus.TRIAL_EXPIRED;
        } else if (activeAt !== null && pausedAt !== null && currentTime >= pausedAt && cancelledAt === null) {
            s = SubscriptionStatus.PASS_DUE;
        } else if (activeAt !== null && cancelledAt !== null && currentTime >= cancelledAt) {
            s = SubscriptionStatus.CANCELLED;
        } else if (activeAt !== null && currentTime < pausedAt) {
            s = SubscriptionStatus.ACTIVE;
        } else if (activeAt !== null && cancelledAt !== null && currentTime < cancelledAt && isTrialSubscription) {
            /**
             * @note this logic refers to docs/paywall.md
             */
            s = SubscriptionStatus.TRIAL_CANCELLED;
        }
        this.status = s;
    }
    status!: SubscriptionStatus;

    static getSubscriptionEntity<T>(e: SubscriptionEntity): SubscriptionEntity<T> {
        return e as SubscriptionEntity<T>;
    }
}
