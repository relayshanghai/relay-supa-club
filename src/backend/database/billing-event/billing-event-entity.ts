import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import type Stripe from 'stripe';

export type StripeObjectData = Stripe.Charge | Stripe.Subscription | Stripe.Invoice;

@Entity({ name: 'billing_events' })
export class BillingEventEntity<T = StripeObjectData> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: CompanyEntity;

    @Column({ default: 'stripe' })
    provider!: string;

    @Column({ name: 'type' })
    type!: string;

    @Column({
        //@ts-ignore
        name: 'data',
        type: 'jsonb',
        transformer: {
            from(value: object) {
                if (typeof value === 'string') return JSON.parse(value);
                return value;
            },
            to(value: object) {
                return JSON.stringify(value);
            },
        },
    })
    data!: T;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;
}
